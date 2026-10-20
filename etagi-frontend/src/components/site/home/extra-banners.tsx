'use client';

import { motion } from 'framer-motion';

export function ExtraBanners() {
  return (
    <section className="sc">
      <div className="w" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="ad-banner" 
          style={{ background: 'linear-gradient(135deg, #2a4263, #13213a)', padding: 30, minHeight: 200 }}
        >
          <div>
            <div className="eb2">Новинка</div>
            <h3 style={{ fontSize: 28 }}>Квартиры с террасой</h3>
            <p style={{ marginBottom: 20 }}>Только в новых ЖК</p>
            <button className="bt">Смотреть</button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="ad-banner" 
          style={{ background: 'linear-gradient(135deg, #c9a36a, #8a5f27)', padding: 30, minHeight: 200 }}
        >
          <div>
            <div className="eb2">Спецпредложение</div>
            <h3 style={{ fontSize: 28 }}>Trade-in недвижимости</h3>
            <p style={{ marginBottom: 20 }}>Обменяйте старую квартиру на новую</p>
            <button className="bt">Узнать больше</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}