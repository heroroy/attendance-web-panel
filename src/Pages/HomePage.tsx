import {useEffect , useState} from "react";
import {ProfileModel} from "../Model/profileModel.ts";
import {ProfileName} from "../Util/Naming_Conv.ts";
import {AddEditModal } from "../Component/addEditModal.tsx";
import {Card} from "../Component/card.tsx";
import {useAppDispatch , useAppSelector} from "../redux/store.ts";
import {getSubjectThunk , subjectAddThunk} from "../redux/subjectSlice.ts";
import {useNavigate} from "react-router-dom";
import _ from 'lodash'

export function HomePage() {
    const [profile, setProfile]= useState<ProfileModel>()
    const [open, setOpen] = useState<boolean>(false)
    // const [subjectCard , setSubjectCard] = useState<cardProps[]>([])
    const [dept, setDept] = useState([])
    const [sub_dept, setSub_dept] = useState([])
    const [data, setData] = useState([])

    const dispatch = useAppDispatch()

    const { subjectArray } = useAppSelector(state => state.subject)

    useEffect(()=>{
        setProfile(JSON.parse(localStorage.getItem("profile")));
        dispatch(getSubjectThunk())
    },[])

    useEffect ( () => {
        let department = []
        subjectArray.map((subjects)=> {
            // console.log(subjects)
            Object.entries ( subjects.subject ).map ( (item: [string , string]) => {
                let key = item[0]
                let value = item[1]
                if (key === "department") department.push(value)
                // if(key==="section") setSub((prevState)=>({...prevState,sec : value}))
            } )
            let newArr = new Set(department)
            let newDept = [...newArr]
            setDept(newDept)
        })
    } , [subjectArray] );

    useEffect ( () => {
        const sub_group = []
        subjectArray.map((subjects)=> {
            sub_group.push(subjects.subject)
        })

        setSub_dept(sub_group)

    } , [dept,subjectArray] );


    const groupdata = _.groupBy(sub_dept,'department')

    console.log(groupdata)

    return (
        <div className="border-2 ">
            <div className="border-2 p-4 flex flex-nowrap ">
                <h3 className="text-xl font-bold mx-auto ">
                    Attend
                    <span className="text-2xl text-blue-500 font-extrabold">Ease</span>
                </h3>
                <img className="h-10 w-10 rounded-full justify-self-end mx-2" src={profile?.pfp}/>
            </div>
            <div className=" m-7 mx-16">
                <h3 className="flex flex-col">
                    <span className="text-gray-500 text-xl">Welcome Back</span>
                    <span className="text-3xl font-bold">{ProfileName(profile?.name)}</span>
                </h3>
            </div>
            <div className="border-2 p-16">
                {/*<div className="grid grid-cols-3 grid-rows-1">*/}
                    {/*{subjectArray.map(item=>(*/}
                    {/*    <div>*/}
                    {/*        <h5>{item.name}</h5>*/}
                    {/*        <Card subjectCard={item}/>*/}
                    {/*    </div>*/}
                    {/*))}*/}
                    {dept.map((items)=>(
                        <div className="flex flex-col">
                            {items}
                            <Card subjectCard={groupdata[items]}/>
                            {/*{Object.entries(sub_dept).map(([key, value]) => (*/}
                            {/*    (key === items) && <Card key={ key } subjectCard={ value }/>*/}
                            {/*    // if(key === items)*/}
                            {/*    //     return (<Card key={ key } subjectCard={ value }/>)*/}
                            {/*))}*/}
                        </div>
                    ))}
                {/*</div>*/}
            </div>
            <button onClick={()=>setOpen(true)} className="px-7 py-3 z-10 rounded-full text-lg text-white bg-blue-600 fixed bottom-3 left-1/2"> + Subject</button >
            {
                open &&
                <AddEditModal profile={profile}  onDismiss={()=>setOpen(false)}/>
            }
        </div>
    );
}

