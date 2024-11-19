export default function TitlePrimary(props: any) {
  return (
    <h1
      className={`${props.className} mt-8 lg:mt-16 mb-2 text-3xl lg:text-5xl font-semibold`}
    >
      {props.children}
    </h1>
  );
}
