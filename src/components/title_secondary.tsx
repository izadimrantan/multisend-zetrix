export default function TitleSecondary(props: any) {
  return (
    <h2
      className={`${props.className} mt-8 lg:mt-16 mb-2 text-1xl lg:text-3xl font-semibold`}
    >
      {props.children}
    </h2>
  );
}
