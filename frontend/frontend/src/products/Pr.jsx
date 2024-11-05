 import React,{useState,useEffect} from 'react'
 import axios  from 'axios'
 function Pr() {
    const [productdetail, setproductdetail] = useState([])
    const fetchproducts=async()=>{
        try {
            
            const fetching = await axios.get('http://localhost:5000/api/products/GetImages')
            const fetched_data=await fetching.data
            if(fetched_data)
                {
                    setproductdetail(fetched_data)
                } 
                console.log("Fetched products",fetched_data);
        } catch (error) {
            console.log(error);
            
        }
            
    }
 useEffect(() => {
fetchproducts()
 }, [])
 
    
   return (
     <div>
       


hii
{productdetail.map((e)=>(
    <div className="div" key={e._id}>

<p>{e.name}</p>
<p>{e.description}</p>
<p>{e.rating}</p>

    </div>
))}

     </div>
   )
 }
 
 export default Pr
 