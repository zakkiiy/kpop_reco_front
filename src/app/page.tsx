'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Login from './components/Login';
import Logout from './components/Logout';

export default function Home() {
	const { data: session, status } = useSession();
	return (
		<div>
			{status === 'authenticated' ? (
				<div>
					<p>セッションの期限：{session.expires}</p>
					<p>ようこそ、{session.user?.name}さん</p>
					<Image
						src={session.user?.image ?? ``}
						height={35}
            width={35}
						alt=""
						style={{ borderRadius: '50px' }}
					/>
					<div>
						<Logout />
					</div>
				</div>
			) : (
				<Login />
			)}
		</div>
	);
}
