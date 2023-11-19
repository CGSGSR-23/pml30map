use async_trait::async_trait;

#[async_trait]
pub trait MapStorage {
    async fn upload_file(&mut self, data: &[u8], file_path: &str) -> anyhow::Result<()>;
    async fn download_file(&mut self, file_path: &str) -> anyhow::Result<Vec<u8>>;
}

pub struct LocalMapStorage {
    base_path: String,
}

impl LocalMapStorage {
    pub fn new(base_path: &str) -> LocalMapStorage {
        LocalMapStorage {
            base_path: String::from(base_path)
        }
    }
}

#[async_trait]
impl MapStorage for LocalMapStorage {
    async fn upload_file(&mut self, data: &[u8], file_path: &str) -> anyhow::Result<()> {
        let full_path_str = format!("{}/{}", self.base_path, file_path);
        let path = std::path::Path::new(full_path_str.as_str());

        return match path.parent().map(|parent_path| return parent_path.exists() || std::fs::create_dir(parent_path).is_ok()) {
            Some(true) => Ok(std::fs::write(path, data)?),
            _ => Err(anyhow::anyhow!("Can't create parent directory")),
        };
    }

    async fn download_file(&mut self, file_path: &str) -> anyhow::Result<Vec<u8>> {
        Ok(std::fs::read(format!("{}/{}", self.base_path, file_path))?)
    }
}