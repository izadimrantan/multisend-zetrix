export default function Paragraph(props: any) {
    return (
        <p className={`${props.className} text-text_primary/80 text-base text-justify`}>{props.children}</p>
    )
}