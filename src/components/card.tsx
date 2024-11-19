export default function Card(props: any) {
  return (
    <div
      className={`${props.className} bg-foreground border border-white/10 shadow-md rounded-xl p-2 lg:p-4`}
    >
      {props.children}
    </div>
  );
}
