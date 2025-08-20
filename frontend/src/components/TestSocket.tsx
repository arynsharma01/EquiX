import io from "socket.io-client"
export default function TestSocket(){

    const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);
  socket.on("stockUpdate", (data : any )=>{
    console.log(data);

    
  })
});
return <div className="text-center text-5xl">
   Hello 
</div>
}