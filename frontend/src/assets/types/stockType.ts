
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