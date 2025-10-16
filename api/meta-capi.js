import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const accessToken = process.env.FB_ACCESS_TOKEN;
    const pixelId = process.env.FB_PIXEL_ID;

    if (!accessToken || !pixelId) {
        console.error("Variables de entorno faltantes");
        return res.status(500).json({ error: 'Variables de entorno faltantes' });
    }

    const {
        type = 'pageview',
        eventId,
        eventSourceUrl,
        userAgent,
        user_data = {}
    } = req.body;

    try {
        const forwardedFor = req.headers['x-forwarded-for'] || '';
        let clientIp = forwardedFor.split(',')[0].trim();

        // Si no hay IP o si es IPv4 pero el cliente soporta IPv6,
        // intenta obtenerla de otra cabecera
        if (!clientIp || clientIp.includes('127.0.0.1')) {
            clientIp = req.socket?.remoteAddress || '';
        }

        // Limpieza de posibles "::ffff:" (IPv4 mapeada a IPv6)
        if (clientIp.startsWith('::ffff:')) {
            clientIp = clientIp.substring(7);
        }

        const payload = {
            data: [
                {
                    event_name: type.toLowerCase() === 'contact' ? 'Contact' :
                        type.toLowerCase() === 'pageview' ? 'PageView' :
                        type.toLowerCase() === 'purchase' ? 'Purchase' :
                        type,
                    event_time: Math.floor(Date.now() / 1000),
                    event_id: eventId || undefined,
                    user_data: {
                        ...user_data,
                        client_user_agent: userAgent || "",
                        client_ip_address: clientIp || ""
                    },
                    event_source_url: eventSourceUrl || '',
                    action_source: 'website'
                }
            ]
        };

        console.log("Payload enviado a Meta:", JSON.stringify(payload, null, 2));

        const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`;
        const response = await axios.post(url, payload);
        res.status(200).json({ success: true, fb: response.data });

    } catch (err) {
        console.error("Error en Meta:", err.response?.data || err.message);
        res.status(500).json({ success: false, error: err.message });
    }
}
