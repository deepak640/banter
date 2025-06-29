import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import authOptions from "@/auth"
import Authform from "./_components/Authform";

export default async function Page() {
  const session = await getServerSession(authOptions); // Replace with your auth logic

  if (session) {
    redirect('/'); // Redirect to homepage
  }
  return (
    <>
      <Authform />
    </>
  )
}
