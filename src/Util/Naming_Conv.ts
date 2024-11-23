
interface ProfileNameMode {
    ProfileName : string
}

export function ProfileName(name : string ): string  {
    let nameString = " "

     name?.split(' ').map((word)=> {
         // console.log(word.substring(0,1) + word.substring(1,word.length).toLowerCase())
         nameString = nameString  + word.substring(0,1) + word.substring ( 1 , word.length ).toLowerCase() + ' '
     })

    return nameString

 }

 export function Initials(name : string) : string {

    let namestring = ""

    name.split(' ').map((word)=>{
        namestring = namestring + word.substring(0,1)
    })
     console.log(namestring)

     return namestring
 }