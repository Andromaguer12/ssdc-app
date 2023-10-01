"use client"
import Header from "@/components/commonLayout/Header/Header"
export default function TournamentsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Header />
                {children}
            </body>
        </html>
    )
}