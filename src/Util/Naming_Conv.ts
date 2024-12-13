export function ProfileName(name : string ): string  {
    // let nameString = " "

    return name.split(" ").map(word => word.charAt(0) + word.substring(1).toLowerCase()).join(" ")

    // return nameString

 }

 export function getDate(dateNumber : number){
     const dateObject = new Date(dateNumber);
     const date = dateObject.getDate();
     const month = dateObject.toLocaleString('default', { month: 'short' });

     // console.log(month)

     return {month, date}
 }

