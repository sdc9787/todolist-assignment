import Image from "next/image";
import Link from "next/link";

export default function Gnb() {
  return (
    <nav className="w-full py-4 flex justify-center items-center border-b border-slate-200 bg-white">
      <div className="w-full px-4 max-w-[1200px] flex justify-start items-center">
        {/* 데스크탑, 태블릿: sm 이상에서만 보임 */}
        <Link href="/">
          <Image src="/img/logo_default.svg" alt="Logo" width={151} height={40} className="mr-2 hidden xs:block" />
        </Link>
        {/* 모바일: sm 미만에서만 보임 */}
        <Link href="/">
          <Image src="/img/logo_mobile.svg" alt="Logo" width={71} height={40} className="mr-2 block xs:hidden" />
        </Link>
      </div>
    </nav>
  );
}
