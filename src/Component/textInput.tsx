import {ChangeEvent} from "react";

interface TextInputProps {
    name: string,
    error?: string,
    id: string,
    value?: any,
    onChange: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined
    className?:string,
    [x: string]: any,
}

export function TextInput({ name , id , value , error , onChange , className, ...props }: TextInputProps) {

    return (
        <>
            <input
                {...props}
                id={ id }
                name={ name }
                value={ value }
                onChange={ onChange }
                className={`block w-full bg-base-200 rounded-md ring-1 ring-inset ring-primary p-4 text-base ${className}`}
            />
            {error && <p>{error}</p>}
        </>
    );
}

