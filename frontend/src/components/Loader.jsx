import ClipLoader from "react-spinners/ClipLoader";

export default function Loader({loading = true, size = 36}) {
  return <div style={{display:"flex", justifyContent:"center", padding:20}}><ClipLoader loading={loading} size={size} /></div>;
}
