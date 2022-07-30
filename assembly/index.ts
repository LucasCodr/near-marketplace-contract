import {context, ContractPromiseBatch, PersistentUnorderedMap} from 'near-sdk-as'
import {listedProducts, Product} from "./model";

export const products = new PersistentUnorderedMap<string, string>('PRODUCTS')

export function setProduct(product: Product): void {
  const storedProduct = listedProducts.get(product.id)

  if (storedProduct !== null)
    throw new Error(`Product with id ${product.id} already exists`)

  listedProducts.set(product.id, Product.fromPayload(product))
}

export function getProduct(id: string): Product | null {
  return listedProducts.get(id)
}

export function getProducts(): Product[] {
  return listedProducts.values()
}

export function buyProduct(productId: string): void {
  const product = getProduct(productId)

  if (product === null)
    throw new Error(`Product with id ${productId} does not exist`)

  if (product.owner === context.sender)
    throw new Error(`You can't buy your own product`)

  if (product.price.toString() != context.attachedDeposit.toString())
    throw new Error(`Product price is ${product.price} but you deposited ${context.attachedDeposit}`)

  ContractPromiseBatch.create(product.owner).transfer(context.attachedDeposit)
  product.incrementSoldAmount()
  listedProducts.set(productId, product)
}
