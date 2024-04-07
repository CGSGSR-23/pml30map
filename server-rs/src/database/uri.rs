use serde_json as json;
use std::mem::MaybeUninit;

#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub struct Uri {
    data: [u8; 12],
}

impl Uri {
    pub fn from_bytes(data: [u8; 12]) -> Uri {
        Self { data }
    }

    pub fn from_slice(slice: &[u8]) -> Option<Uri> {
        if slice.len() >= 12 {
            unsafe {
                #[allow(invalid_value)]
                let mut data = MaybeUninit::<Uri>::uninit().assume_init();

                std::ptr::copy_nonoverlapping(slice.as_ptr(), data.data.as_mut_ptr(), 12);

                Some(data)
            }
        } else {
            None
        }
    }

    pub fn from_json(json: json::Value) -> Option<Uri> {
        let arr = json.as_array()?;

        if arr.len() >= 12 {
            Some(Self {
                data: unsafe {
                    [
                        arr.get_unchecked(0).as_i64()?.try_into().ok()?,
                        arr.get_unchecked(1).as_i64()?.try_into().ok()?,
                        arr.get_unchecked(2).as_i64()?.try_into().ok()?,
                        arr.get_unchecked(3).as_i64()?.try_into().ok()?,
                        arr.get_unchecked(4).as_i64()?.try_into().ok()?,
                        arr.get_unchecked(5).as_i64()?.try_into().ok()?,
                        arr.get_unchecked(6).as_i64()?.try_into().ok()?,
                        arr.get_unchecked(7).as_i64()?.try_into().ok()?,
                        arr.get_unchecked(8).as_i64()?.try_into().ok()?,
                        arr.get_unchecked(9).as_i64()?.try_into().ok()?,
                        arr.get_unchecked(10).as_i64()?.try_into().ok()?,
                        arr.get_unchecked(11).as_i64()?.try_into().ok()?,
                    ]
                },
            })
        } else {
            None
        }
    }

    pub fn from_str(string: &str) -> Option<Uri> {
        Self::from_json(json::from_str(string).ok()?)
    }

    pub fn bytes(self) -> [u8; 12] {
        self.data
    }
}

impl Default for Uri {
    fn default() -> Self {
        Self {
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    }
}

impl ToString for Uri {
    fn to_string(&self) -> String {
        format!(
            "[{},{},{},{},{},{},{},{},{},{},{},{}]",
            self.data[0],
            self.data[1],
            self.data[2],
            self.data[3],
            self.data[4],
            self.data[5],
            self.data[6],
            self.data[7],
            self.data[8],
            self.data[9],
            self.data[10],
            self.data[11]
        )
    }
}
