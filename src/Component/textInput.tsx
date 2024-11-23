import {ChangeEvent} from "react";

interface TextInputProps {
    name: string,
    error?: string,
    id: string,
    value?: any,
    onChange: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined
    [x: string]: any,
}

export function TextInput({ name , id , value , error , onChange , ...props }: TextInputProps) {
    return (
        <input
            {...props}
            id={ id }
            name={ name }
            value={ value }
            onChange={ onChange }
        />
    );
}

