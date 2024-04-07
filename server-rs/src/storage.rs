use async_trait::async_trait;

#[async_trait]
pub trait MapStorage {
    async fn upload_file(&mut self, data: &[u8], file_path: &str) -> Result<(), String>;
    async fn download_file(&mut self, file_path: &str) -> Result<Vec<u8>, String>;
}

pub struct LocalMapStorage {
    base_path: String,
}

impl LocalMapStorage {
    pub fn new(base_path: &str) -> LocalMapStorage {
        LocalMapStorage {
            base_path: String::from(base_path),
        }
    }
}

#[async_trait]
impl MapStorage for LocalMapStorage {
    async fn upload_file(&mut self, data: &[u8], file_path: &str) -> Result<(), String> {
        let full_path_str = format!("{}/{}", self.base_path, file_path);
        let path = std::path::Path::new(full_path_str.as_str());

        return match path.parent().map(|parent_path| {
            return parent_path.exists() || std::fs::create_dir(parent_path).is_ok();
        }) {
            Some(true) => Ok(std::fs::write(path, data).map_err(|v| v.to_string())?),
            _ => Err("Can't create parent directory".into()),
        };
    }

    async fn download_file(&mut self, file_path: &str) -> Result<Vec<u8>, String> {
        Ok(
            std::fs::read(format!("{}/{}", self.base_path, file_path))
                .map_err(|v| v.to_string())?,
        )
    }
}
