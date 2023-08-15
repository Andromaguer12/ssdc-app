import { useAppSelector } from '@/redux/store'
import Link from 'next/link'
import React from 'react'

const Dashboard = () => {
    const adminUser = useAppSelector(state => state.user);
    return (
        <main>
            <h1>{`Panel Administrativo: (${adminUser.name || "usuario no identificado"})`}</h1>
            <ul>
                <li><Link href={''}>Registrar Torneo</Link></li>
                <li><Link href={''}>Editar Torneo</Link></li>
                <li><Link href={''}>Administrar Usuarios</Link></li>
            </ul>
        </main>
    )
}

export default Dashboard