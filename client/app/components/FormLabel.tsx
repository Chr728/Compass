interface formlabelprops {
    htmlFor: string;
    label: string;
}

const result = ( props: formlabelprops ): JSX.Element => {
    return (
        <>
        <label
          htmlFor= {props.htmlFor}
          className="font-sans font-medium text-grey text-[16px]"
        >
         {props.label}
        </label>
        <span className="text-red text-[20px]"> *</span>
        <br />
        </>
    )
}

export default result;