export default function ButtonPrimary(props: any) {
  return (
    <button
      type={props.type ? props.type : "button"}
      className={`inline-flex items-center bg-gradient-to-b from-button_primary_gradient_1 to-button_primary_gradient_2 border border-primary_red px-4 py-2 rounded-xl font-medium shadow-md text-sm ${props.className}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
