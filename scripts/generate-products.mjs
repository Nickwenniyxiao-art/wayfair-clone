/**
 * Generate 200 Nordic Minimalist Style Products
 * 
 * This script creates a comprehensive product catalog with:
 * - 80 Furniture items
 * - 70 Decor items  
 * - 50 Lighting items
 * 
 * Each product includes:
 * - Bilingual names and descriptions (English/Chinese)
 * - High-quality Unsplash CDN images
 * - Realistic pricing and inventory
 * - Ratings and review counts
 */

// Product categories
const categories = [
  {
    id: 1,
    name: 'Furniture',
    name_zh: '家具',
    slug: 'furniture',
    description: 'Nordic minimalist furniture for modern living',
    description_zh: '现代生活的北欧极简家具',
    icon: '🪑',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 2,
    name: 'Decor',
    name_zh: '装饰',
    slug: 'decor',
    description: 'Elegant decorative items to enhance your space',
    description_zh: '优雅的装饰品提升您的空间',
    icon: '🎨',
    displayOrder: 2,
    isActive: true
  },
  {
    id: 3,
    name: 'Lighting',
    name_zh: '照明',
    slug: 'lighting',
    description: 'Modern lighting solutions for every room',
    description_zh: '适合每个房间的现代照明解决方案',
    icon: '💡',
    displayOrder: 3,
    isActive: true
  }
];

// Furniture products (80 items)
const furnitureProducts = [
  // Sofas & Seating (20 items)
  ...Array.from({ length: 20 }, (_, i) => {
    const types = ['Sofa', 'Sectional', 'Loveseat', 'Armchair', 'Lounge Chair'];
    const styles = ['Minimalist', 'Scandinavian', 'Modern', 'Contemporary', 'Nordic'];
    const colors = ['White', 'Gray', 'Beige', 'Cream', 'Light Oak'];
    
    const type = types[i % types.length];
    const style = styles[i % styles.length];
    const color = colors[i % colors.length];
    
    return {
      sku: `FUR-SOFA-${String(i + 1).padStart(3, '0')}`,
      name: `${style} ${color} ${type}`,
      name_zh: `${style === 'Minimalist' ? '极简' : style === 'Scandinavian' ? '斯堪的纳维亚' : style === 'Modern' ? '现代' : style === 'Contemporary' ? '当代' : '北欧'}${color === 'White' ? '白色' : color === 'Gray' ? '灰色' : color === 'Beige' ? '米色' : color === 'Cream' ? '奶油色' : '浅橡木色'}${type === 'Sofa' ? '沙发' : type === 'Sectional' ? '组合沙发' : type === 'Loveseat' ? '双人沙发' : type === 'Armchair' ? '扶手椅' : '休闲椅'}`,
      slug: `${style.toLowerCase()}-${color.toLowerCase()}-${type.toLowerCase()}-${i + 1}`,
      description: `Experience ultimate comfort with our ${style} ${color} ${type}. Crafted with premium materials and clean lines, this piece embodies Nordic design principles. Perfect for modern living spaces seeking elegance and functionality.`,
      description_zh: `体验我们的${style === 'Minimalist' ? '极简' : style === 'Scandinavian' ? '斯堪的纳维亚' : style === 'Modern' ? '现代' : style === 'Contemporary' ? '当代' : '北欧'}${color === 'White' ? '白色' : color === 'Gray' ? '灰色' : color === 'Beige' ? '米色' : color === 'Cream' ? '奶油色' : '浅橡木色'}${type === 'Sofa' ? '沙发' : type === 'Sectional' ? '组合沙发' : type === 'Loveseat' ? '双人沙发' : type === 'Armchair' ? '扶手椅' : '休闲椅'}的终极舒适。采用优质材料和简洁线条制作，体现北欧设计理念。非常适合追求优雅和功能性的现代生活空间。`,
      categoryId: 1,
      price: (799 + i * 50).toFixed(2),
      compareAtPrice: (999 + i * 50).toFixed(2),
      stock: 15 + (i % 30),
      imageUrl: `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&sig=${i}`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&sig=${i}`,
        `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&sig=${i + 1000}`
      ]),
      rating: (4.5 + Math.random() * 0.4).toFixed(1),
      reviewCount: 15 + (i % 35),
      isFeatured: i < 5,
      isActive: true
    };
  }),
  
  // Tables (15 items)
  ...Array.from({ length: 15 }, (_, i) => {
    const types = ['Dining Table', 'Coffee Table', 'Side Table', 'Console Table', 'Desk'];
    const materials = ['Oak', 'Walnut', 'Marble', 'Glass', 'White'];
    
    const type = types[i % types.length];
    const material = materials[i % materials.length];
    
    return {
      sku: `FUR-TABLE-${String(i + 1).padStart(3, '0')}`,
      name: `${material} ${type}`,
      name_zh: `${material === 'Oak' ? '橡木' : material === 'Walnut' ? '胡桃木' : material === 'Marble' ? '大理石' : material === 'Glass' ? '玻璃' : '白色'}${type === 'Dining Table' ? '餐桌' : type === 'Coffee Table' ? '咖啡桌' : type === 'Side Table' ? '边桌' : type === 'Console Table' ? '玄关桌' : '书桌'}`,
      slug: `${material.toLowerCase()}-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      description: `Elegant ${material} ${type} featuring clean Scandinavian design. The natural wood grain and minimalist structure create a timeless piece that complements any interior. Durable construction ensures years of reliable use.`,
      description_zh: `优雅的${material === 'Oak' ? '橡木' : material === 'Walnut' ? '胡桃木' : material === 'Marble' ? '大理石' : material === 'Glass' ? '玻璃' : '白色'}${type === 'Dining Table' ? '餐桌' : type === 'Coffee Table' ? '咖啡桌' : type === 'Side Table' ? '边桌' : type === 'Console Table' ? '玄关桌' : '书桌'}，采用简洁的斯堪的纳维亚设计。天然木纹和极简结构打造出永恒的作品，与任何室内装饰相得益彰。坚固的结构确保多年可靠使用。`,
      categoryId: 1,
      price: (399 + i * 40).toFixed(2),
      compareAtPrice: (499 + i * 40).toFixed(2),
      stock: 20 + (i % 25),
      imageUrl: `https://images.unsplash.com/photo-${1506439689479 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1506439689479 + i}?w=800&q=80`,
        `https://images.unsplash.com/photo-${1506439689479 + i + 1}?w=800&q=80`
      ]),
      rating: (4.6 + Math.random() * 0.3).toFixed(1),
      reviewCount: 20 + (i % 30),
      isFeatured: i < 3,
      isActive: true
    };
  }),
  
  // Chairs (15 items)
  ...Array.from({ length: 15 }, (_, i) => {
    const types = ['Dining Chair', 'Office Chair', 'Accent Chair', 'Bar Stool', 'Rocking Chair'];
    const styles = ['Minimalist', 'Ergonomic', 'Upholstered', 'Wooden', 'Metal'];
    
    const type = types[i % types.length];
    const style = styles[i % styles.length];
    
    return {
      sku: `FUR-CHAIR-${String(i + 1).padStart(3, '0')}`,
      name: `${style} ${type}`,
      name_zh: `${style === 'Minimalist' ? '极简' : style === 'Ergonomic' ? '人体工学' : style === 'Upholstered' ? '软垫' : style === 'Wooden' ? '木质' : '金属'}${type === 'Dining Chair' ? '餐椅' : type === 'Office Chair' ? '办公椅' : type === 'Accent Chair' ? '装饰椅' : type === 'Bar Stool' ? '吧台椅' : '摇椅'}`,
      slug: `${style.toLowerCase()}-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      description: `Comfortable ${style} ${type} designed for modern living. Features premium materials, ergonomic support, and timeless Nordic aesthetics. Perfect addition to any contemporary space.`,
      description_zh: `舒适的${style === 'Minimalist' ? '极简' : style === 'Ergonomic' ? '人体工学' : style === 'Upholstered' ? '软垫' : style === 'Wooden' ? '木质' : '金属'}${type === 'Dining Chair' ? '餐椅' : type === 'Office Chair' ? '办公椅' : type === 'Accent Chair' ? '装饰椅' : type === 'Bar Stool' ? '吧台椅' : '摇椅'}，专为现代生活而设计。采用优质材料、符合人体工程学的支撑和永恒的北欧美学。是任何当代空间的完美补充。`,
      categoryId: 1,
      price: (199 + i * 30).toFixed(2),
      compareAtPrice: (249 + i * 30).toFixed(2),
      stock: 25 + (i % 40),
      imageUrl: `https://images.unsplash.com/photo-${1503602642458 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1503602642458 + i}?w=800&q=80`,
        `https://images.unsplash.com/photo-${1503602642458 + i + 1}?w=800&q=80`
      ]),
      rating: (4.5 + Math.random() * 0.4).toFixed(1),
      reviewCount: 18 + (i % 28),
      isFeatured: i < 2,
      isActive: true
    };
  }),
  
  // Beds & Bedroom (15 items)
  ...Array.from({ length: 15 }, (_, i) => {
    const types = ['Bed Frame', 'Platform Bed', 'Nightstand', 'Dresser', 'Wardrobe'];
    const sizes = ['Queen', 'King', 'Full', 'Twin', 'California King'];
    
    const type = types[i % types.length];
    const size = sizes[i % sizes.length];
    
    return {
      sku: `FUR-BED-${String(i + 1).padStart(3, '0')}`,
      name: `${size} ${type}`,
      name_zh: `${size === 'Queen' ? '大号' : size === 'King' ? '特大号' : size === 'Full' ? '标准' : size === 'Twin' ? '单人' : '加州特大号'}${type === 'Bed Frame' ? '床架' : type === 'Platform Bed' ? '平台床' : type === 'Nightstand' ? '床头柜' : type === 'Dresser' ? '梳妆台' : '衣柜'}`,
      slug: `${size.toLowerCase()}-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      description: `Sophisticated ${size} ${type} with clean lines and minimalist design. Crafted from premium materials for durability and style. Creates a serene bedroom atmosphere with Nordic simplicity.`,
      description_zh: `精致的${size === 'Queen' ? '大号' : size === 'King' ? '特大号' : size === 'Full' ? '标准' : size === 'Twin' ? '单人' : '加州特大号'}${type === 'Bed Frame' ? '床架' : type === 'Platform Bed' ? '平台床' : type === 'Nightstand' ? '床头柜' : type === 'Dresser' ? '梳妆台' : '衣柜'}，线条简洁，设计极简。采用优质材料制作，兼具耐用性和风格。以北欧简约风格营造宁静的卧室氛围。`,
      categoryId: 1,
      price: (449 + i * 50).toFixed(2),
      compareAtPrice: (599 + i * 50).toFixed(2),
      stock: 12 + (i % 20),
      imageUrl: `https://images.unsplash.com/photo-${1505693314120 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1505693314120 + i}?w=800&q=80`,
        `https://images.unsplash.com/photo-${1505693314120 + i + 1}?w=800&q=80`
      ]),
      rating: (4.7 + Math.random() * 0.2).toFixed(1),
      reviewCount: 25 + (i % 35),
      isFeatured: i < 3,
      isActive: true
    };
  }),
  
  // Storage & Shelving (15 items)
  ...Array.from({ length: 15 }, (_, i) => {
    const types = ['Bookshelf', 'Storage Cabinet', 'TV Stand', 'Sideboard', 'Shelving Unit'];
    const styles = ['Wall-Mounted', 'Freestanding', 'Modular', 'Corner', 'Floating'];
    
    const type = types[i % types.length];
    const style = styles[i % styles.length];
    
    return {
      sku: `FUR-STOR-${String(i + 1).padStart(3, '0')}`,
      name: `${style} ${type}`,
      name_zh: `${style === 'Wall-Mounted' ? '壁挂式' : style === 'Freestanding' ? '独立式' : style === 'Modular' ? '模块化' : style === 'Corner' ? '角落' : '悬浮'}${type === 'Bookshelf' ? '书架' : type === 'Storage Cabinet' ? '储物柜' : type === 'TV Stand' ? '电视柜' : type === 'Sideboard' ? '餐边柜' : '置物架'}`,
      slug: `${style.toLowerCase()}-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      description: `Functional ${style} ${type} combining Nordic aesthetics with practical storage. Clean design maximizes space while maintaining visual lightness. Perfect for organizing your modern home.`,
      description_zh: `实用的${style === 'Wall-Mounted' ? '壁挂式' : style === 'Freestanding' ? '独立式' : style === 'Modular' ? '模块化' : style === 'Corner' ? '角落' : '悬浮'}${type === 'Bookshelf' ? '书架' : type === 'Storage Cabinet' ? '储物柜' : type === 'TV Stand' ? '电视柜' : type === 'Sideboard' ? '餐边柜' : '置物架'}，将北欧美学与实用储物相结合。简洁的设计最大化空间，同时保持视觉轻盈。非常适合整理您的现代家居。`,
      categoryId: 1,
      price: (299 + i * 35).toFixed(2),
      compareAtPrice: (399 + i * 35).toFixed(2),
      stock: 18 + (i % 30),
      imageUrl: `https://images.unsplash.com/photo-${1524758631624 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1524758631624 + i}?w=800&q=80`,
        `https://images.unsplash.com/photo-${1524758631624 + i + 1}?w=800&q=80`
      ]),
      rating: (4.6 + Math.random() * 0.3).toFixed(1),
      reviewCount: 22 + (i % 32),
      isFeatured: i < 2,
      isActive: true
    };
  })
];

// Decor products (70 items)
const decorProducts = [
  // Wall Art (15 items)
  ...Array.from({ length: 15 }, (_, i) => {
    const types = ['Canvas Print', 'Framed Art', 'Metal Wall Art', 'Wood Wall Art', 'Abstract Print'];
    const themes = ['Geometric', 'Nature', 'Abstract', 'Minimalist', 'Botanical'];
    
    const type = types[i % types.length];
    const theme = themes[i % themes.length];
    
    return {
      sku: `DEC-WALL-${String(i + 1).padStart(3, '0')}`,
      name: `${theme} ${type}`,
      name_zh: `${theme === 'Geometric' ? '几何' : theme === 'Nature' ? '自然' : theme === 'Abstract' ? '抽象' : theme === 'Minimalist' ? '极简' : '植物'}${type === 'Canvas Print' ? '画布印刷品' : type === 'Framed Art' ? '装裱艺术品' : type === 'Metal Wall Art' ? '金属墙艺' : type === 'Wood Wall Art' ? '木质墙艺' : '抽象印刷品'}`,
      slug: `${theme.toLowerCase()}-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      description: `Stunning ${theme} ${type} that adds sophistication to any wall. Museum-quality printing on premium materials. Perfect for creating a gallery wall or standalone statement piece.`,
      description_zh: `令人惊叹的${theme === 'Geometric' ? '几何' : theme === 'Nature' ? '自然' : theme === 'Abstract' ? '抽象' : theme === 'Minimalist' ? '极简' : '植物'}${type === 'Canvas Print' ? '画布印刷品' : type === 'Framed Art' ? '装裱艺术品' : type === 'Metal Wall Art' ? '金属墙艺' : type === 'Wood Wall Art' ? '木质墙艺' : '抽象印刷品'}，为任何墙面增添精致感。在优质材料上进行博物馆级印刷。非常适合创建画廊墙或独立的装饰品。`,
      categoryId: 2,
      price: (79 + i * 15).toFixed(2),
      compareAtPrice: (129 + i * 15).toFixed(2),
      stock: 30 + (i % 50),
      imageUrl: `https://images.unsplash.com/photo-${1513519107455 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1513519107455 + i}?w=800&q=80`
      ]),
      rating: (4.5 + Math.random() * 0.4).toFixed(1),
      reviewCount: 12 + (i % 25),
      isFeatured: i < 3,
      isActive: true
    };
  }),
  
  // Vases & Planters (15 items)
  ...Array.from({ length: 15 }, (_, i) => {
    const types = ['Ceramic Vase', 'Glass Vase', 'Planter', 'Flower Pot', 'Decorative Bowl'];
    const colors = ['White', 'Gray', 'Black', 'Terracotta', 'Cream'];
    
    const type = types[i % types.length];
    const color = colors[i % colors.length];
    
    return {
      sku: `DEC-VASE-${String(i + 1).padStart(3, '0')}`,
      name: `${color} ${type}`,
      name_zh: `${color === 'White' ? '白色' : color === 'Gray' ? '灰色' : color === 'Black' ? '黑色' : color === 'Terracotta' ? '赤陶色' : '奶油色'}${type === 'Ceramic Vase' ? '陶瓷花瓶' : type === 'Glass Vase' ? '玻璃花瓶' : type === 'Planter' ? '花盆' : type === 'Flower Pot' ? '花盆' : '装饰碗'}`,
      slug: `${color.toLowerCase()}-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      description: `Elegant ${color} ${type} with minimalist Scandinavian design. Handcrafted with attention to detail. Perfect for fresh flowers, dried arrangements, or as a standalone decorative piece.`,
      description_zh: `优雅的${color === 'White' ? '白色' : color === 'Gray' ? '灰色' : color === 'Black' ? '黑色' : color === 'Terracotta' ? '赤陶色' : '奶油色'}${type === 'Ceramic Vase' ? '陶瓷花瓶' : type === 'Glass Vase' ? '玻璃花瓶' : type === 'Planter' ? '花盆' : type === 'Flower Pot' ? '花盆' : '装饰碗'}，采用极简的斯堪的纳维亚设计。手工制作，注重细节。非常适合鲜花、干花布置或作为独立装饰品。`,
      categoryId: 2,
      price: (39 + i * 10).toFixed(2),
      compareAtPrice: (59 + i * 10).toFixed(2),
      stock: 40 + (i % 60),
      imageUrl: `https://images.unsplash.com/photo-${1485955900006 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1485955900006 + i}?w=800&q=80`
      ]),
      rating: (4.6 + Math.random() * 0.3).toFixed(1),
      reviewCount: 15 + (i % 30),
      isFeatured: i < 2,
      isActive: true
    };
  }),
  
  // Rugs & Textiles (10 items)
  ...Array.from({ length: 10 }, (_, i) => {
    const types = ['Area Rug', 'Runner', 'Throw Blanket', 'Cushion Cover', 'Curtain'];
    const patterns = ['Geometric', 'Solid', 'Striped', 'Textured', 'Woven'];
    
    const type = types[i % types.length];
    const pattern = patterns[i % patterns.length];
    
    return {
      sku: `DEC-TEXT-${String(i + 1).padStart(3, '0')}`,
      name: `${pattern} ${type}`,
      name_zh: `${pattern === 'Geometric' ? '几何' : pattern === 'Solid' ? '纯色' : pattern === 'Striped' ? '条纹' : pattern === 'Textured' ? '纹理' : '编织'}${type === 'Area Rug' ? '地毯' : type === 'Runner' ? '走廊地毯' : type === 'Throw Blanket' ? '毛毯' : type === 'Cushion Cover' ? '靠垫套' : '窗帘'}`,
      slug: `${pattern.toLowerCase()}-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      description: `Luxurious ${pattern} ${type} made from premium materials. Adds warmth and texture to your space while maintaining Nordic simplicity. Easy to clean and maintain.`,
      description_zh: `豪华的${pattern === 'Geometric' ? '几何' : pattern === 'Solid' ? '纯色' : pattern === 'Striped' ? '条纹' : pattern === 'Textured' ? '纹理' : '编织'}${type === 'Area Rug' ? '地毯' : type === 'Runner' ? '走廊地毯' : type === 'Throw Blanket' ? '毛毯' : type === 'Cushion Cover' ? '靠垫套' : '窗帘'}，采用优质材料制成。为您的空间增添温暖和质感，同时保持北欧简约。易于清洁和维护。`,
      categoryId: 2,
      price: (89 + i * 20).toFixed(2),
      compareAtPrice: (129 + i * 20).toFixed(2),
      stock: 25 + (i % 35),
      imageUrl: `https://images.unsplash.com/photo-${1519710164239 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1519710164239 + i}?w=800&q=80`
      ]),
      rating: (4.5 + Math.random() * 0.4).toFixed(1),
      reviewCount: 18 + (i % 28),
      isFeatured: i < 2,
      isActive: true
    };
  }),
  
  // Mirrors (10 items)
  ...Array.from({ length: 10 }, (_, i) => {
    const shapes = ['Round', 'Rectangular', 'Oval', 'Square', 'Arched'];
    const frames = ['Wood Frame', 'Metal Frame', 'Frameless', 'Black Frame', 'Gold Frame'];
    
    const shape = shapes[i % shapes.length];
    const frame = frames[i % frames.length];
    
    return {
      sku: `DEC-MIRR-${String(i + 1).padStart(3, '0')}`,
      name: `${shape} ${frame} Mirror`,
      name_zh: `${shape === 'Round' ? '圆形' : shape === 'Rectangular' ? '矩形' : shape === 'Oval' ? '椭圆形' : shape === 'Square' ? '方形' : '拱形'}${frame === 'Wood Frame' ? '木框' : frame === 'Metal Frame' ? '金属框' : frame === 'Frameless' ? '无框' : frame === 'Black Frame' ? '黑框' : '金框'}镜子`,
      slug: `${shape.toLowerCase()}-${frame.toLowerCase().replace(/\s+/g, '-')}-mirror-${i + 1}`,
      description: `Elegant ${shape} mirror with ${frame.toLowerCase()}. High-quality glass provides crystal-clear reflection. Perfect for entryways, bathrooms, or as a decorative accent.`,
      description_zh: `优雅的${shape === 'Round' ? '圆形' : shape === 'Rectangular' ? '矩形' : shape === 'Oval' ? '椭圆形' : shape === 'Square' ? '方形' : '拱形'}镜子，配有${frame === 'Wood Frame' ? '木框' : frame === 'Metal Frame' ? '金属框' : frame === 'Frameless' ? '无框' : frame === 'Black Frame' ? '黑框' : '金框'}。高品质玻璃提供清晰的反射。非常适合门厅、浴室或作为装饰点缀。`,
      categoryId: 2,
      price: (129 + i * 25).toFixed(2),
      compareAtPrice: (179 + i * 25).toFixed(2),
      stock: 20 + (i % 30),
      imageUrl: `https://images.unsplash.com/photo-${1618220179428 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1618220179428 + i}?w=800&q=80`
      ]),
      rating: (4.7 + Math.random() * 0.2).toFixed(1),
      reviewCount: 20 + (i % 30),
      isFeatured: i < 2,
      isActive: true
    };
  }),
  
  // Decorative Objects (20 items)
  ...Array.from({ length: 20 }, (_, i) => {
    const types = ['Sculpture', 'Candle Holder', 'Tray', 'Box', 'Bookend', 'Clock', 'Photo Frame', 'Basket'];
    const materials = ['Ceramic', 'Wood', 'Metal', 'Marble', 'Glass'];
    
    const type = types[i % types.length];
    const material = materials[i % materials.length];
    
    return {
      sku: `DEC-OBJ-${String(i + 1).padStart(3, '0')}`,
      name: `${material} ${type}`,
      name_zh: `${material === 'Ceramic' ? '陶瓷' : material === 'Wood' ? '木质' : material === 'Metal' ? '金属' : material === 'Marble' ? '大理石' : '玻璃'}${type === 'Sculpture' ? '雕塑' : type === 'Candle Holder' ? '烛台' : type === 'Tray' ? '托盘' : type === 'Box' ? '盒子' : type === 'Bookend' ? '书挡' : type === 'Clock' ? '时钟' : type === 'Photo Frame' ? '相框' : '篮子'}`,
      slug: `${material.toLowerCase()}-${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      description: `Beautifully crafted ${material} ${type} with minimalist Nordic design. Adds character and functionality to any space. Perfect for styling shelves, tables, or mantels.`,
      description_zh: `精美制作的${material === 'Ceramic' ? '陶瓷' : material === 'Wood' ? '木质' : material === 'Metal' ? '金属' : material === 'Marble' ? '大理石' : '玻璃'}${type === 'Sculpture' ? '雕塑' : type === 'Candle Holder' ? '烛台' : type === 'Tray' ? '托盘' : type === 'Box' ? '盒子' : type === 'Bookend' ? '书挡' : type === 'Clock' ? '时钟' : type === 'Photo Frame' ? '相框' : '篮子'}，采用极简的北欧设计。为任何空间增添个性和功能性。非常适合装饰架子、桌子或壁炉架。`,
      categoryId: 2,
      price: (49 + i * 12).toFixed(2),
      compareAtPrice: (69 + i * 12).toFixed(2),
      stock: 35 + (i % 45),
      imageUrl: `https://images.unsplash.com/photo-${1493663284031 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1493663284031 + i}?w=800&q=80`
      ]),
      rating: (4.5 + Math.random() * 0.4).toFixed(1),
      reviewCount: 10 + (i % 20),
      isFeatured: i < 3,
      isActive: true
    };
  })
];

// Lighting products (50 items)
const lightingProducts = [
  // Pendant Lights (15 items)
  ...Array.from({ length: 15 }, (_, i) => {
    const styles = ['Modern', 'Industrial', 'Minimalist', 'Geometric', 'Globe'];
    const finishes = ['Matte Black', 'Brass', 'White', 'Chrome', 'Copper'];
    
    const style = styles[i % styles.length];
    const finish = finishes[i % finishes.length];
    
    return {
      sku: `LIT-PEND-${String(i + 1).padStart(3, '0')}`,
      name: `${style} ${finish} Pendant Light`,
      name_zh: `${style === 'Modern' ? '现代' : style === 'Industrial' ? '工业' : style === 'Minimalist' ? '极简' : style === 'Geometric' ? '几何' : '球形'}${finish === 'Matte Black' ? '哑光黑' : finish === 'Brass' ? '黄铜' : finish === 'White' ? '白色' : finish === 'Chrome' ? '铬' : '铜'}吊灯`,
      slug: `${style.toLowerCase()}-${finish.toLowerCase().replace(/\s+/g, '-')}-pendant-${i + 1}`,
      description: `Striking ${style} pendant light in ${finish.toLowerCase()} finish. Creates ambient lighting with Nordic elegance. Perfect for dining rooms, kitchens, or entryways. Adjustable height for versatile installation.`,
      description_zh: `引人注目的${style === 'Modern' ? '现代' : style === 'Industrial' ? '工业' : style === 'Minimalist' ? '极简' : style === 'Geometric' ? '几何' : '球形'}吊灯，${finish === 'Matte Black' ? '哑光黑' : finish === 'Brass' ? '黄铜' : finish === 'White' ? '白色' : finish === 'Chrome' ? '铬' : '铜'}饰面。以北欧优雅营造环境照明。非常适合餐厅、厨房或门厅。可调节高度，安装多样化。`,
      categoryId: 3,
      price: (149 + i * 30).toFixed(2),
      compareAtPrice: (199 + i * 30).toFixed(2),
      stock: 15 + (i % 25),
      imageUrl: `https://images.unsplash.com/photo-${1513506003 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1513506003 + i}?w=800&q=80`,
        `https://images.unsplash.com/photo-${1513506003 + i + 1}?w=800&q=80`
      ]),
      rating: (4.6 + Math.random() * 0.3).toFixed(1),
      reviewCount: 18 + (i % 28),
      isFeatured: i < 3,
      isActive: true
    };
  }),
  
  // Table Lamps (12 items)
  ...Array.from({ length: 12 }, (_, i) => {
    const bases = ['Ceramic', 'Wood', 'Metal', 'Marble', 'Glass'];
    const shades = ['Linen', 'Paper', 'Fabric', 'Metal', 'Glass'];
    
    const base = bases[i % bases.length];
    const shade = shades[i % shades.length];
    
    return {
      sku: `LIT-TABLE-${String(i + 1).padStart(3, '0')}`,
      name: `${base} Base ${shade} Shade Table Lamp`,
      name_zh: `${base === 'Ceramic' ? '陶瓷' : base === 'Wood' ? '木质' : base === 'Metal' ? '金属' : base === 'Marble' ? '大理石' : '玻璃'}底座${shade === 'Linen' ? '亚麻' : shade === 'Paper' ? '纸' : shade === 'Fabric' ? '布' : shade === 'Metal' ? '金属' : '玻璃'}灯罩台灯`,
      slug: `${base.toLowerCase()}-${shade.toLowerCase()}-table-lamp-${i + 1}`,
      description: `Elegant table lamp featuring ${base.toLowerCase()} base and ${shade.toLowerCase()} shade. Provides warm, diffused lighting perfect for reading or ambient illumination. Timeless Nordic design complements any decor.`,
      description_zh: `优雅的台灯，配有${base === 'Ceramic' ? '陶瓷' : base === 'Wood' ? '木质' : base === 'Metal' ? '金属' : base === 'Marble' ? '大理石' : '玻璃'}底座和${shade === 'Linen' ? '亚麻' : shade === 'Paper' ? '纸' : shade === 'Fabric' ? '布' : shade === 'Metal' ? '金属' : '玻璃'}灯罩。提供温暖的漫射照明，非常适合阅读或环境照明。永恒的北欧设计与任何装饰相得益彰。`,
      categoryId: 3,
      price: (99 + i * 20).toFixed(2),
      compareAtPrice: (139 + i * 20).toFixed(2),
      stock: 20 + (i % 30),
      imageUrl: `https://images.unsplash.com/photo-${1507473885765 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1507473885765 + i}?w=800&q=80`
      ]),
      rating: (4.7 + Math.random() * 0.2).toFixed(1),
      reviewCount: 22 + (i % 32),
      isFeatured: i < 2,
      isActive: true
    };
  }),
  
  // Floor Lamps (10 items)
  ...Array.from({ length: 10 }, (_, i) => {
    const types = ['Arc', 'Tripod', 'Torchiere', 'Reading', 'Corner'];
    const styles = ['Modern', 'Minimalist', 'Industrial', 'Scandinavian', 'Contemporary'];
    
    const type = types[i % types.length];
    const style = styles[i % styles.length];
    
    return {
      sku: `LIT-FLOOR-${String(i + 1).padStart(3, '0')}`,
      name: `${style} ${type} Floor Lamp`,
      name_zh: `${style === 'Modern' ? '现代' : style === 'Minimalist' ? '极简' : style === 'Industrial' ? '工业' : style === 'Scandinavian' ? '斯堪的纳维亚' : '当代'}${type === 'Arc' ? '弧形' : type === 'Tripod' ? '三脚架' : type === 'Torchiere' ? '火炬' : type === 'Reading' ? '阅读' : '角落'}落地灯`,
      slug: `${style.toLowerCase()}-${type.toLowerCase()}-floor-lamp-${i + 1}`,
      description: `Sophisticated ${style} ${type} floor lamp with clean lines and functional design. Provides ample lighting for living rooms, bedrooms, or offices. Adjustable features for customized illumination.`,
      description_zh: `精致的${style === 'Modern' ? '现代' : style === 'Minimalist' ? '极简' : style === 'Industrial' ? '工业' : style === 'Scandinavian' ? '斯堪的纳维亚' : '当代'}${type === 'Arc' ? '弧形' : type === 'Tripod' ? '三脚架' : type === 'Torchiere' ? '火炬' : type === 'Reading' ? '阅读' : '角落'}落地灯，线条简洁，设计实用。为客厅、卧室或办公室提供充足的照明。可调节功能，定制照明。`,
      categoryId: 3,
      price: (179 + i * 35).toFixed(2),
      compareAtPrice: (249 + i * 35).toFixed(2),
      stock: 12 + (i % 20),
      imageUrl: `https://images.unsplash.com/photo-${1540932239986 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1540932239986 + i}?w=800&q=80`
      ]),
      rating: (4.6 + Math.random() * 0.3).toFixed(1),
      reviewCount: 16 + (i % 24),
      isFeatured: i < 2,
      isActive: true
    };
  }),
  
  // Wall Sconces (8 items)
  ...Array.from({ length: 8 }, (_, i) => {
    const styles = ['Modern', 'Minimalist', 'Industrial', 'Swing Arm', 'Candle'];
    const finishes = ['Matte Black', 'Brass', 'White', 'Chrome', 'Bronze'];
    
    const style = styles[i % styles.length];
    const finish = finishes[i % finishes.length];
    
    return {
      sku: `LIT-SCONCE-${String(i + 1).padStart(3, '0')}`,
      name: `${style} ${finish} Wall Sconce`,
      name_zh: `${style === 'Modern' ? '现代' : style === 'Minimalist' ? '极简' : style === 'Industrial' ? '工业' : style === 'Swing Arm' ? '摆臂' : '蜡烛'}${finish === 'Matte Black' ? '哑光黑' : finish === 'Brass' ? '黄铜' : finish === 'White' ? '白色' : finish === 'Chrome' ? '铬' : '青铜'}壁灯`,
      slug: `${style.toLowerCase()}-${finish.toLowerCase().replace(/\s+/g, '-')}-sconce-${i + 1}`,
      description: `Sleek ${style} wall sconce in ${finish.toLowerCase()} finish. Perfect for hallways, bedrooms, or as accent lighting. Energy-efficient LED compatible. Easy installation with included hardware.`,
      description_zh: `时尚的${style === 'Modern' ? '现代' : style === 'Minimalist' ? '极简' : style === 'Industrial' ? '工业' : style === 'Swing Arm' ? '摆臂' : '蜡烛'}壁灯，${finish === 'Matte Black' ? '哑光黑' : finish === 'Brass' ? '黄铜' : finish === 'White' ? '白色' : finish === 'Chrome' ? '铬' : '青铜'}饰面。非常适合走廊、卧室或作为重点照明。兼容节能 LED。附带硬件，易于安装。`,
      categoryId: 3,
      price: (89 + i * 18).toFixed(2),
      compareAtPrice: (129 + i * 18).toFixed(2),
      stock: 25 + (i % 35),
      imageUrl: `https://images.unsplash.com/photo-${1534349762230 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1534349762230 + i}?w=800&q=80`
      ]),
      rating: (4.5 + Math.random() * 0.4).toFixed(1),
      reviewCount: 14 + (i % 22),
      isFeatured: i < 2,
      isActive: true
    };
  }),
  
  // Ceiling Lights (5 items)
  ...Array.from({ length: 5 }, (_, i) => {
    const types = ['Flush Mount', 'Semi-Flush', 'Chandelier', 'Track Lighting', 'Recessed'];
    const styles = ['Modern', 'Minimalist', 'Contemporary', 'Industrial', 'Scandinavian'];
    
    const type = types[i % types.length];
    const style = styles[i % styles.length];
    
    return {
      sku: `LIT-CEIL-${String(i + 1).padStart(3, '0')}`,
      name: `${style} ${type} Ceiling Light`,
      name_zh: `${style === 'Modern' ? '现代' : style === 'Minimalist' ? '极简' : style === 'Contemporary' ? '当代' : style === 'Industrial' ? '工业' : '斯堪的纳维亚'}${type === 'Flush Mount' ? '吸顶灯' : type === 'Semi-Flush' ? '半吸顶灯' : type === 'Chandelier' ? '吊灯' : type === 'Track Lighting' ? '轨道灯' : '嵌入式'}吸顶灯`,
      slug: `${style.toLowerCase()}-${type.toLowerCase().replace(/\s+/g, '-')}-ceiling-${i + 1}`,
      description: `Elegant ${style} ${type} ceiling light with superior illumination. Perfect for living rooms, bedrooms, or dining areas. Energy-efficient design with long-lasting LED bulbs. Easy to install and maintain.`,
      description_zh: `优雅的${style === 'Modern' ? '现代' : style === 'Minimalist' ? '极简' : style === 'Contemporary' ? '当代' : style === 'Industrial' ? '工业' : '斯堪的纳维亚'}${type === 'Flush Mount' ? '吸顶灯' : type === 'Semi-Flush' ? '半吸顶灯' : type === 'Chandelier' ? '吊灯' : type === 'Track Lighting' ? '轨道灯' : '嵌入式'}吸顶灯，照明效果卓越。非常适合客厅、卧室或餐厅。节能设计，配备持久的 LED 灯泡。易于安装和维护。`,
      categoryId: 3,
      price: (119 + i * 40).toFixed(2),
      compareAtPrice: (169 + i * 40).toFixed(2),
      stock: 18 + (i % 28),
      imageUrl: `https://images.unsplash.com/photo-${1565538810323 + i}?w=800&q=80`,
      images: JSON.stringify([
        `https://images.unsplash.com/photo-${1565538810323 + i}?w=800&q=80`
      ]),
      rating: (4.7 + Math.random() * 0.2).toFixed(1),
      reviewCount: 20 + (i % 30),
      isFeatured: i < 1,
      isActive: true
    };
  })
];

// Combine all products
const allProducts = [
  ...furnitureProducts,
  ...decorProducts,
  ...lightingProducts
];

// Export data
export const productData = {
  categories,
  products: allProducts,
  summary: {
    totalProducts: allProducts.length,
    furniture: furnitureProducts.length,
    decor: decorProducts.length,
    lighting: lightingProducts.length
  }
};

console.log('✅ Generated product data:');
console.log(`   - Total: ${productData.summary.totalProducts} products`);
console.log(`   - Furniture: ${productData.summary.furniture} products`);
console.log(`   - Decor: ${productData.summary.decor} products`);
console.log(`   - Lighting: ${productData.summary.lighting} products`);
