import "server-only"

const DEFAULT_NAME = "RageRoom Directory"
const DEFAULT_SUPPORT = "Order support: ukrageroom@gmail.com"
const DEFAULT_RETURNS = "Email ukrageroom@gmail.com for return instructions before posting anything."

export function shopSeller() {
  return {
    name: process.env.SHOP_SELLER_NAME?.trim() || DEFAULT_NAME,
    address: process.env.SHOP_SELLER_ADDRESS?.trim() || DEFAULT_SUPPORT,
    returnsAddress: process.env.SHOP_RETURNS_ADDRESS?.trim() || DEFAULT_RETURNS,
    supplier: process.env.SHOP_SUPPLIER_NAME?.trim() || "",
  }
}
