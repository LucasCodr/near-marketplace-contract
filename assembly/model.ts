import {context, PersistentUnorderedMap, u128} from 'near-sdk-as'

@nearBindgen
export class Product {
  id: string
  name: string
  description: string
  image: string
  location: string
  price: u128
  owner: string
  sold: u32

  public static fromPayload(payload: Product): Product {
    const product = new Product()

    product.id = payload.id
    product.name = payload.name
    product.description = payload.description
    product.image = payload.image
    product.location = payload.location
    product.price = payload.price
    product.owner = context.sender
    product.sold = payload.sold

    return product
  }

  public incrementSoldAmount(): void {
    this.sold++
  }
}

export const listedProducts = new PersistentUnorderedMap<string, Product>('LISTED_PRODUCTS')
