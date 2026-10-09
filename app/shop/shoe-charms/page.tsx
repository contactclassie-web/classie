import { permanentRedirect } from "next/navigation";

// The Shoe Charms page lives at /shop/clips (the menu link). Old links to
// /shop/shoe-charms go there, so customers never see an outdated copy.
export default function ShoeCharmsRedirect() {
  permanentRedirect("/shop/clips");
}
