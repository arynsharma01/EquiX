import {atom} from 'jotai'
import { type result } from '../assets/types/stockType'
type StockBuyer = {
    price : number , 
    quantity : number,
    orderType : "sell" | "buy"
}
export const popularStocksInfo  = atom<result[]>([])




export const sellAAPL  = atom<StockBuyer[]>()
export const buyAAPL = atom<StockBuyer[]>()

export const sellMSFT = atom<StockBuyer[]>()
export const buyMSFT = atom<StockBuyer[]>()

export const sellNVDA = atom<StockBuyer[]>()
export const buyNVDA = atom<StockBuyer[]>()

export const sellAMZN = atom<StockBuyer[]>()
export const buyAMZN = atom<StockBuyer[]>()
 
export const sellTSLA = atom<StockBuyer[]>()
export const buyTSLA = atom<StockBuyer[]>()

export const sellNFLX = atom<StockBuyer[]>()
export const buyNFLX = atom<StockBuyer[]>()