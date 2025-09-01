
export default interface StockType  {
    symbol: string,
    value: string,
    up: boolean,
    gainValue: number,
    gainPercent : number,
    

}
export  type ResultChildType = {

    duration?: string,
    closingValues: number[],
    dateTime?: string[],
    volume: number,
    longName : string,
    gainPercent : number,
    gainValue : number 


}

export type result = {

    symbol: string,
    child: ResultChildType[]

}

export interface Transactions{
    
    id: string
    symbol: string
    date: string
    orderType: string
    price: number
    quantity: number
    completed: Boolean
    cancelled: Boolean
    filled: number
}

