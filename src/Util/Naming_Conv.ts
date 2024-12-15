export function capitalizeWords(name: string): string {
    return name.split(" ").map(word => word.charAt(0) + word.substring(1).toLowerCase()).join(" ")
}

export function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export function getDate(dateNumber: number) {
    const dateObject = new Date(dateNumber);
    const date = dateObject.getDate();
    const month = dateObject.toLocaleString('default', {month: 'short'});

    // console.log(month)

    return {month, date}
}

export function StringFormat(data : string){
    return data.split(" ").map(word =>  word.charAt(0)).join("")
}
