interface entryprops {
    label: string;
    value: string;
}

const result = ( props: entryprops ): JSX.Element => {
    return (
        <>
            <p
            className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
            style={ { display: 'inline' } }
            >
            {props.label}
            </p>
            <p
            className="text-md ml-2 text-darkgrey"
            style={ { display: 'inline' } }
            >
            {props.value}
            </p><br></br>
        </>
    )
}

export default result;