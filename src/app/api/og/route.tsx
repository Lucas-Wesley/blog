import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title') || 'Lucas Wesley - Blog'
    const category = searchParams.get('category') || 'Tecnologia'
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
            }}
          >
            <img
              alt="Lucas Wesley"
              height={200}
              src="data:image/svg+xml,%3csvg%20width='100'%20height='100'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='100'%20height='100'%20fill='white'%20rx='50'/%3e%3ctext%20x='50'%20y='50'%20font-family='Arial'%20font-size='40'%20fill='%231E3A8A'%20text-anchor='middle'%20dy='0.3em'%3eLW%3c/text%3e%3c/svg%3e"
              style={{
                margin: '0 30px',
              }}
              width={200}
            />
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 40,
              fontStyle: 'normal',
              fontWeight: 700,
              color: 'white',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
              textAlign: 'center',
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              fontStyle: 'normal',
              fontWeight: 400,
              color: '#E5E7EB',
              marginTop: 20,
            }}
          >
            {category} • Lucas Wesley - Blog
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
} 