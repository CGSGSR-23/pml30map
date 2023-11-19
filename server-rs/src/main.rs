use std::net::SocketAddr;
use warp::Filter;

mod storage;
mod database;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Parse socket address
    let output_address: SocketAddr = std::env::args().nth(1).unwrap_or("127.0.0.1:3047".into()).parse()?;
    
    // parse greeting
    let main_page = warp::any()
        .map(|| warp::reply::html(include_str!("static/index.html")))
        ;

    warp::serve(main_page).run(output_address).await;

    Ok(())
}