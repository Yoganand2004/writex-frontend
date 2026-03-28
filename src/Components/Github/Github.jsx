import { useEffect, useState } from "react"

function Github() {
  const [data,setData] = useState([]);
  useEffect(()=>{
    fetch("https://api.github.com/users/Yoganand2004").
    then(response=>response.json()).
    then(data=> {
      setData(data);
      console.log(data)
    }
    )

  },[])
  return (
    <>
    <div className="bg-secondary p-3 m-2">
      <h2 className="text-white">GitHub : {data.login}</h2>
        <div className=" d-flex justify-content-between align-items-center rounded">
      <img 
      className="rounded"
      src={data.avatar_url} 
      alt="GitHub Logo"
      width="150"
      height="150"
      />
      <div>
        <h4 className="text-white ">GitHub following: {data.following}</h4>
        <h4 className="text-white ">GitHub Followers: {data.followers}</h4>
      </div>
      
    </div>
    </div>
    
    </>
  )
}

export default Github