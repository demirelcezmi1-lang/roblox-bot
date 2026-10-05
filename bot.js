const noblox = require('noblox.js');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// GÜVENLİK ANAHTARI (Oyununuzla bot arasındaki şifre)
const SECURITY_KEY = "SizinGizliSifreniz123"; 

async function startBot() {
    // 7/24 Aktiflik için basit bir ana sayfa görünümü
    app.get('/', (req, res) => {
        res.send("Roblox Rütbe Botu 7/24 Aktif Durumda!");
    });

    // Rütbe Değiştirme İstek Noktası (Oyun içi HttpService buraya bağlanacak)
    app.get('/setrank', async (req, res) => {
        const { key, userid, groupid, rankid } = req.query;

        // Güvenlik Kontrolü
        if (key !== SECURITY_KEY) {
            return res.status(403).send("Hatalı Güvenlik Anahtarı!");
        }

        if (!userid || !groupid || !rankid) {
            return res.status(400).send("Eksik bilgi gönderildi!");
        }

        try {
            // Roblox üzerinde rütbe değiştirme işlemi tetikleniyor
            await noblox.setRank({
                group: Number(groupid),
                target: Number(userid),
                rank: Number(rankid)
            });
            console.log(`Başarılı: ${userid} ID'li kullanıcı ${rankid} rütbesine yükseltildi.`);
            res.send("Rütbe başarıyla güncellendi!");
        } catch (err) {
            console.error("Rütbe değiştirilirken hata oluştu:", err);
            res.status(500).send("Roblox API Hatası: " + err.message);
        }
    });

    // Bot Hesap Girişi (.ROBLOSECURITY çerezi çevre değişkenlerinden okunur)
    try {
        await noblox.cookieLogin(process.env.ROBLOX_COOKIE);
        const botUser = await noblox.getCurrentUser();
        console.log(`Bot başarıyla aktif edildi! Giriş yapılan hesap: ${botUser.UserName}`);
    } catch (cookieError) {
        console.error("Roblox çerez girişi başarısız oldu! Lütfen COOKIE değerinizi kontrol edin.");
    }

    app.listen(PORT, () => {
        console.log(`Sunucu ${PORT} portunda başarıyla başlatıldı.`);
    });
}

startBot();
