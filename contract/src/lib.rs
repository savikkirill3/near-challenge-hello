use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, PanicOnDefault, AccountId};
use near_sdk::collections::UnorderedMap;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    pub names: UnorderedMap<AccountId, String>
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            names: UnorderedMap::new(b"s".to_vec())
        }
    }

    pub fn hello_near(&self, name: String) -> String {
      format!("Hello {}!", name)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::{VMContextBuilder};
    use near_sdk::{testing_env, AccountId};

    fn get_context(predecessor: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(predecessor);
        builder
    }
    
    #[test]
    fn check_hello() {
        let skn = AccountId::new_unchecked("sknx_x.testnet".to_string());
        let context = get_context(skn);
        testing_env!(context.build());

        let mut contract = Contract::new();
        let result = contract.hello_near("skn".to_string());
    }
}