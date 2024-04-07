use database::Database;
use std::net::SocketAddr;
use warp::Filter;

mod database;
mod storage;

#[tokio::main]
async fn main() -> Result<(), String> {
    {
        println!("NODE SKYSPHERE PATHS");
        let nodes = database::MongoDB::new("mongodb://127.0.0.1:27017")
            .await
            .ok_or("Error connecting to MongoDB Database".to_owned())?
            .get_all_nodes()
            .await
            .ok_or("Error getting all nodes".to_owned())?;

        for node in nodes {
            println!("  {}", node.skysphere.path);
        }
    }

    // Parse socket address
    let output_address: SocketAddr = std::env::args()
        .nth(1)
        .unwrap_or("127.0.0.1:3047".into())
        .parse::<SocketAddr>()
        .map_err(|v| v.to_string())?;

    // parse greeting
    let main_page = warp::any().map(|| warp::reply::html(include_str!("static/index.html")));

    warp::serve(main_page).run(output_address).await;

    Ok(())
}
