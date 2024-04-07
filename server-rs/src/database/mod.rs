mod uri;

mod mongodb;

pub use mongodb::MongoDB;

use async_trait::async_trait;
pub use uri::Uri;

#[derive(Clone, Debug)]
pub struct NodeSkysphereData {
    pub path: String,
    pub rotation: f32,
}

#[derive(Clone, Debug)]
pub struct Node {
    pub uri: Uri,
    pub name: String,
    pub skysphere: NodeSkysphereData,
    pub position: (f32, f32, f32),
    pub floor: i32,
}

#[async_trait]
pub trait Database {
    /// Node by uri getting function
    async fn get_node(&self, uri: Uri) -> Option<Node>;

    /// Node in database updating function
    async fn update_node(&mut self, uri: Uri, new_data: Node) -> Option<()>;

    /// Node delete function
    async fn delete_node(&mut self, uri: Uri) -> Option<()>;

    /// Node adding function
    async fn add_node(&mut self, data: Node) -> Option<Uri>;

    /// All node connections getting function
    async fn get_node_connections(&self, uri: Uri) -> Option<Vec<(Uri, Uri)>>;

    /// Full connection list getting function
    async fn get_all_connections(&self) -> Option<Vec<(Uri, Uri)>>;

    // Node neighbour set getting function
    async fn get_node_neighbours(&self, uri: Uri) -> Option<Vec<Uri>>;

    // Connection set getting function
    async fn add_connection(&mut self, uri1: Uri, uri2: Uri) -> Option<()>;

    // Default node getting function
    async fn get_default_node_uri(&self) -> Option<Uri>;

    async fn set_default_node_uri(&mut self, new_uri: Uri) -> Option<()>;
    async fn get_all_node_uris(&self) -> Option<Vec<Uri>>;
    async fn get_all_nodes(&self) -> Option<Vec<Node>>;
}
