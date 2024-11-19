export default function Subtitle(props: any) {
  return (
    <p className={`${props.className} text-text_secondary text-xs lg:text-sm`}>
      {props.children}
    </p>
  );
}
