import { MainApp } from "@/components/MainApp";
import { Language } from "@/locales/translations";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const nameParam = params.name || params.to || params.invitee;
  const name = typeof nameParam === "string" ? nameParam : "";

  const langParam = params.lang || params.language;
  let lang: Language = "ka"; // Default to Georgian
  
  if (typeof langParam === "string" && ["ka", "en", "ru", "fr"].includes(langParam)) {
    lang = langParam as Language;
  }

  return <MainApp name={name} lang={lang} />;
}
