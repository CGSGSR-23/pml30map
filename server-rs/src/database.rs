use async_trait::async_trait;
use anyhow::Result;

#[derive(Clone, Debug)]
pub struct Node {
    pub uri: String,
    pub name: String,
    pub skysphere: (String, f32),
    pub position: (f32, f32, f32),
    pub floor: i32,
}

pub type Uri = String;

#[async_trait]
pub trait Database {

    /// Node by uri getting function
    async fn get_node(uri: Uri) -> Result<Node>;

    /// Node in database updating function
    async fn update_node(uri: Uri, new_data: Node) -> Result<()>;

    /// Node delete function
    async fn delete_node(uri: Uri) -> Result<()>;

    /// Node adding function
    async fn add_node(data: Node) -> Result<Uri>;

    /// All node connections getting function
    async fn get_node_connections(uri: Uri) -> Result<Vec<(Uri, Uri)>>;

    /// Full connection list getting function
    async fn get_all_connections() -> Result<Vec<(Uri, Uri)>>;


    async fn get_node_neighbours(uri: Uri) -> Result<Vec<Uri>>;
    async fn add_connection(uri1: Uri, uri2: Uri) -> Result<()>;
    async fn get_default_node_uri() -> Result<Uri>;
    async fn set_default_node_uri(new_uri: Uri) -> Result<()>;
    async fn get_all_node_uris() -> Result<Vec<Uri>>;
    async fn get_all_nodes() -> Result<Vec<Node>>;
}

pub struct MongoDB {
    client: mongodb::Client,
    database: mongodb::Database,
}

impl MongoDB {
    pub async fn new(uri: &str, database_name: &str) -> Result<MongoDB> {
        let client = mongodb::Client::with_uri_str(uri).await?;
        let db = client.database(database_name);

        Ok(MongoDB {
            client,
            database: db
        })
    }
}

#[async_trait]
impl Database for MongoDB {

    /// Node by uri getting function
    async fn get_node(uri: Uri) -> Result<Node> {
        todo!();
    }

    /// Node in database updating function
    async fn update_node(uri: Uri, new_data: Node) -> Result<()> {
        todo!();
    }

    /// Node delete function
    async fn delete_node(uri: Uri) -> Result<()> {
        todo!();
    }

    /// Node adding function
    async fn add_node(data: Node) -> Result<Uri> {
        todo!();
    }

    /// All node connections getting function
    async fn get_node_connections(uri: Uri) -> Result<Vec<(Uri, Uri)>> {
        todo!();
    }

    /// Full connection list getting function
    async fn get_all_connections() -> Result<Vec<(Uri, Uri)>> {
        todo!();
    }

    
    async fn get_node_neighbours(uri: Uri) -> Result<Vec<Uri>> {
        todo!();
    }
    async fn add_connection(uri1: Uri, uri2: Uri) -> Result<()> {
        todo!();
    }
    async fn get_default_node_uri() -> Result<Uri> {
        todo!();
    }
    async fn set_default_node_uri(new_uri: Uri) -> Result<()> {
        todo!();
    }
    async fn get_all_node_uris() -> Result<Vec<Uri>> {
        todo!();
    }
    async fn get_all_nodes() -> Result<Vec<Node>> {
        todo!();
    }
}