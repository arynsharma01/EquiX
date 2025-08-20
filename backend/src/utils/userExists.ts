import singlePrismaClient from "./prismaClient";

export default async function userExists(email:string , mobile?:string ):Promise<boolean>{
    try{

    const prisma = singlePrismaClient()
    console.log(email);
    
    const existingUser = await prisma.user.findFirst({
        where :{
            OR :[
                {email : email},
                {mobile : mobile as string}
            ]
        }
    })
    
    
    if(existingUser){
        return true ;
    }
    return false ;
}
catch(e){
    console.log(e);
    
    return true 
}
    
}