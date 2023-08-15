import DashboardHome from '@/components/commonLayout/Dashboard/DashboardHome'
import Link from 'next/link'
import React from 'react'

const DashboardAdminIndex = () => {
    return (
        <DashboardHome>
            <main>
                <h1>Panel Administrativo</h1>
                <ul>
                    <li><Link href={''}>Registrar Torneo</Link></li>
                    <li><Link href={''}>Editar Torneo</Link></li>
                    <li><Link href={''}>Administrar Usuarios</Link></li>
                </ul>
            </main>
        </DashboardHome>
    )
}

export default DashboardAdminIndex