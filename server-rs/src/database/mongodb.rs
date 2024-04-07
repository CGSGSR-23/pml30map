use super::{Node, NodeSkysphereData, Uri};

use base64::prelude::*;

pub struct MongoDB {
    nodes: mongodb::Collection<mongodb::bson::Document>,
    connections: mongodb::Collection<mongodb::bson::Document>,
    variables: mongodb::Collection<mongodb::bson::Document>,
}

impl MongoDB {
    pub async fn new(uri: &str) -> Option<Self> {
        let client =
            mongodb::Client::with_options(mongodb::options::ClientOptions::parse(uri).await.ok()?)
                .ok()?;
        let database = client.database("pml30map");

        // Some()
        Some(Self {
            nodes: database.collection::<mongodb::bson::Document>("nodes"),
            connections: database.collection::<mongodb::bson::Document>("connections"),
            variables: database.collection::<mongodb::bson::Document>("variables"),
        })
    }

    /// All node connections getting function
    async fn get_node_connections_filter(
        &self,
        filter: Option<mongodb::bson::Document>,
    ) -> Option<Vec<(Uri, Uri)>> {
        let mut cursor = self.connections.find(filter, None).await.ok()?;
        let mut data = Vec::<(Uri, Uri)>::new();

        loop {
            if let Some(v) = raw_document_to_connection(cursor.current()) {
                data.push(v)
            }

            if !cursor.advance().await.unwrap_or(false) {
                break;
            }
        }

        Some(data)
    }
}

impl Into<mongodb::bson::Document> for Node {
    fn into(self) -> mongodb::bson::Document {
        mongodb::bson::doc! {
            "_id": mongodb::bson::oid::ObjectId::from(self.uri.bytes()),
            "name": self.name,
            "position": {
                "x": self.position.0,
                "y": self.position.1,
                "z": self.position.2,
            },
            "skysphere": {
                "path": self.skysphere.path,
                "rotation": self.skysphere.rotation,
            },
            "floor": self.floor,
        }
    }
}

impl From<&mongodb::bson::RawDocumentBuf> for Node {
    fn from(value: &mongodb::bson::RawDocumentBuf) -> Self {
        Self {
            floor: value.get_i32("floor").unwrap_or(0),
            name: value.get_str("name").unwrap_or("").to_owned(),
            position: value
                .get_document("position")
                .map_or((0.0, 0.0, 0.0), |position| {
                    (
                        position.get_f64("x").unwrap_or(0.0) as f32,
                        position.get_f64("y").unwrap_or(0.0) as f32,
                        position.get_f64("z").unwrap_or(0.0) as f32,
                    )
                }),
            skysphere: value.get_document("skysphere").map_or(
                NodeSkysphereData {
                    path: "".into(),
                    rotation: 0.0,
                },
                |data| NodeSkysphereData {
                    path: data.get_str("path").unwrap_or("").to_owned(),
                    rotation: data.get_f64("rotation").unwrap_or(0.0) as f32,
                },
            ),
            uri: value
                .get_object_id("_id")
                .map(|v| Uri::from_bytes(v.bytes()))
                .unwrap_or(Uri::default()),
        }
    }
}

impl Into<mongodb::bson::oid::ObjectId> for Uri {
    fn into(self) -> mongodb::bson::oid::ObjectId {
        mongodb::bson::oid::ObjectId::from(self.bytes())
    }
}

impl From<mongodb::bson::oid::ObjectId> for Uri {
    fn from(value: mongodb::bson::oid::ObjectId) -> Self {
        Self::from_bytes(value.bytes())
    }
}

fn raw_document_to_connection(doc: &mongodb::bson::RawDocument) -> Option<(Uri, Uri)> {
    Some((
        doc.get_str("id1").ok().map(Uri::from_str).flatten()?,
        doc.get_str("id1").ok().map(Uri::from_str).flatten()?,
    ))
}

#[async_trait::async_trait]
impl super::Database for MongoDB {
    /// Node by uri getting function
    async fn get_node(&self, uri: Uri) -> Option<Node> {
        self.nodes
            .find_one(
                Some(
                    mongodb::bson::doc! { "_id": Into::<mongodb::bson::oid::ObjectId>::into(uri), },
                ),
                None,
            )
            .await
            .ok()
            .flatten()
            .map(|v| {
                let raw = mongodb::bson::RawDocumentBuf::from_document(&v)
                    .ok()?
                    .to_raw_document_buf();
                Some(Into::<Node>::into(&raw))
            })
            .flatten()
    }

    /// Node in database updating function
    async fn update_node(&mut self, uri: Uri, new_data: Node) -> Option<()> {
        self.nodes
            .update_one(
                mongodb::bson::doc! { "_id": Into::<mongodb::bson::oid::ObjectId>::into(uri), },
                Into::<mongodb::bson::document::Document>::into(new_data),
                None,
            )
            .await
            .map(|_| ())
            .ok()
    }

    /// Node delete function
    async fn delete_node(&mut self, uri: Uri) -> Option<()> {
        self.nodes
            .delete_one(
                mongodb::bson::doc! { "_id": Into::<mongodb::bson::oid::ObjectId>::into(uri), },
                None,
            )
            .await
            .map(|_| ())
            .ok()
    }

    /// Node adding function
    async fn add_node(&mut self, data: Node) -> Option<Uri> {
        self.nodes
            .insert_one(Into::<mongodb::bson::Document>::into(data), None)
            .await
            .ok()
            .map(|v| v.inserted_id.as_object_id())
            .flatten()
            .map(|v| Uri::from(v))
    }

    /// All node connections getting function
    async fn get_node_connections(&self, uri: Uri) -> Option<Vec<(Uri, Uri)>> {
        let a1 = self
            .get_node_connections_filter(Some(
                mongodb::bson::doc! {"id1" :Into::<mongodb::bson::oid::ObjectId>::into(uri)},
            ))
            .await;
        let a2 = self
            .get_node_connections_filter(Some(
                mongodb::bson::doc! {"id2" :Into::<mongodb::bson::oid::ObjectId>::into(uri)},
            ))
            .await;

        a1.zip(a2).map(|mut v| {
            v.0.append(&mut v.1);
            v.0
        })
    }

    /// Full connection list getting function
    async fn get_all_connections(&self) -> Option<Vec<(Uri, Uri)>> {
        self.get_node_connections_filter(None).await
    }

    // Node neighbour set getting function
    async fn get_node_neighbours(&self, uri: Uri) -> Option<Vec<Uri>> {
        self.get_node_connections(uri).await.map(|arr| {
            arr.into_iter()
                .map(|v| if uri != v.0 { v.0 } else { v.1 })
                .collect::<Vec<Uri>>()
        })
    }

    // Connection set getting function
    async fn add_connection(&mut self, uri1: Uri, uri2: Uri) -> Option<()> {
        self.connections
            .insert_one(
                mongodb::bson::doc! {
                    "id1": Into::<mongodb::bson::oid::ObjectId>::into(uri1),
                    "id2": Into::<mongodb::bson::oid::ObjectId>::into(uri2),
                },
                None,
            )
            .await
            .ok()
            .map(|_| ())
    }

    // Default node getting function
    async fn get_default_node_uri(&self) -> Option<Uri> {
        self.variables
            .find_one(Some(mongodb::bson::doc! { "var_name": "DefNodeURI" }), None)
            .await
            .ok()
            .flatten()
            .map(|doc| {
                doc.get_binary_generic("uri")
                    .ok()
                    .map(|v| Uri::from_slice(v.as_slice()))
            })
            .flatten()
            .flatten()
    }

    async fn set_default_node_uri(&mut self, new_uri: Uri) -> Option<()> {
        self.variables
            .update_one(
                mongodb::bson::doc! { "var_name": "DefNodeURI" },
                mongodb::bson::doc! {
                    "uri": mongodb::bson::binary::Binary::from_base64(BASE64_STANDARD.encode(new_uri.bytes().as_slice()), None).ok()?
                },
                None,
            )
            .await
            .ok()
            .map(|_| ())
    }

    async fn get_all_nodes(&self) -> Option<Vec<Node>> {
        let mut cursor = self.nodes.find(None, None).await.ok()?;
        let mut nodes: Vec<Node> = Vec::new();

        loop {
            nodes.push(Into::<Node>::into(&cursor.current().to_raw_document_buf()));

            if !cursor.advance().await.unwrap_or(false) {
                break;
            }
        }

        Some(nodes)
    }

    async fn get_all_node_uris(&self) -> Option<Vec<Uri>> {
        let mut cursor = self.nodes.find(None, None).await.ok()?;
        let mut uris: Vec<Uri> = Vec::new();

        loop {
            if let Ok(objid) = cursor.current().get_object_id("_id") {
                uris.push(Uri::from(objid));
            }

            if !cursor.advance().await.unwrap_or(false) {
                break;
            }
        }

        Some(uris)
    }
}
