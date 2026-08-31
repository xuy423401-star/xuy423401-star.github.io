export type PhotoChapterId = 'desert' | 'water' | 'daily' | 'trace';

export type PhotographyWork = {
  slug: string;
  number: string;
  title: string;
  englishTitle: string;
  chapter: PhotoChapterId;
  file: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
  short: string;
  note: string;
};

export type PhotoChapter = {
  id: PhotoChapterId;
  number: string;
  label: string;
  english: string;
  title: string;
  intro: string;
  works: PhotographyWork[];
};

const image = (file: string, width: number, height: number) => {
  const stem = file.replace(/^\d+-/, '').replace(/\.[^.]+$/, '');
  return {
    file: `/photography/${stem}-large.webp`,
    thumb: `/photography/${stem}-thumb.webp`,
    width,
    height,
  };
};

const allWorks: PhotographyWork[] = [
  { slug: 'photo-01-tree-desert', number: '01', title: '荒原上的树', englishTitle: 'Tree in the Desert', chapter: 'desert', ...image('0f0a3666-bf6f-4525-aff2-998920af668f_live1778386067703.jpg', 1296, 1728), alt: '一棵枯树独立在沙漠地平线上。', short: '一棵树把荒原分成风吹过的两半。', note: '枯树的枝干像一张伸向天空的手，周围没有建筑和人，只有沙丘与明亮天光。它不是风景里的装饰，而是荒原中仍保持方向感的生命。' },
  { slug: 'photo-02-glass-in-sand', number: '02', title: '沙里的碎光', englishTitle: 'Glass in Sand', chapter: 'desert', ...image('2bb8635f-fb03-41c8-80d2-0005a0f099ef_live1778386059094.jpg', 1296, 1728), alt: '彩色碎片散落在沙地上。', short: '被遗落的碎片，在沙地上重新组成一片光。', note: '绿色与透明碎片被沙丘包围，既像垃圾，也像被时间磨圆的宝石。照片让“被丢弃之物”获得了新的观看价值，也提醒我们美感常在秩序崩解之后才出现。' },
  { slug: 'photo-03-sand-line', number: '03', title: '沙丘的边界', englishTitle: 'Edge of the Dune', chapter: 'desert', ...image('4497d531-d3df-4425-aeb8-5a266c92e315_live1778386052543.jpg', 1728, 1296), alt: '蓝天下的沙丘、栅栏与远处房屋。', short: '一条栅栏试图为流动的沙定义边界。', note: '水平沙丘、细栅栏和远处小屋构成几层不同尺度的秩序。沙随风移动，栅栏却坚持原地；两者之间是人对自然建立的短暂约定。' },
  { slug: 'photo-04-dune-solitude', number: '04', title: '无人处', englishTitle: 'A Place Without Us', chapter: 'desert', ...image('724bf391-1be0-45b7-ac5f-ac1ab2de2e38_live1778386060904.jpg', 1296, 1728), alt: '空旷沙丘与极少量植被。', short: '当人退出画面，沙丘开始拥有自己的时间。', note: '大面积蓝天与沙地压低了视觉事件，只留下几处稀疏植物和远方小点。空旷不是空无，而是让观看从“寻找主体”转向感受尺度。' },
  { slug: 'photo-05-salt-water', number: '05', title: '盐地回声', englishTitle: 'Echoes on Salt', chapter: 'desert', ...image('841b2dcb-89c0-459c-9da6-39e64a7975bc_live1778386115282.jpg', 3264, 1836), alt: '盐地、水面与远处的浅色地平线。', short: '水与盐把天空折叠成一块薄薄的镜面。', note: '低饱和的粉、蓝和灰在地面交汇，远处的地平线几乎消失。照片像一张正在褪色的地图，记录自然如何把边界慢慢改写。' },
  { slug: 'photo-06-misty-grove', number: '06', title: '雾中的树林', englishTitle: 'Grove in Mist', chapter: 'water', ...image('IMG20241113191053.jpg', 4096, 3072), alt: '薄雾中的树林与草地。', short: '雾把树林变成一间没有墙的房间。', note: '树干以垂直线条站在雾气里，前景草地则像一层柔软地毯。远近被雾抹平，空间因此更像记忆，而不是可以被准确抵达的地点。' },
  { slug: 'photo-07-autumn-path', number: '07', title: '秋天经过这里', englishTitle: 'Autumn Passed Here', chapter: 'water', ...image('IMG20241116152915.jpg', 3072, 4096), alt: '红叶树木围绕一条铺满落叶的小路。', short: '落叶把一条普通的路写成了季节的句子。', note: '红叶、暗绿和湿润地面形成深沉的色彩层次。道路向画面深处收束，像在邀请人继续走，也像在提醒：每一步都踩在正在消失的时间上。' },
  { slug: 'photo-08-shelf-of-books', number: '08', title: '被翻开的世界', englishTitle: 'A World Opened', chapter: 'water', ...image('IMG20250107171430.jpg', 3072, 4096), alt: '桌面上摊开的书籍与纸张。', short: '书页把许多陌生人的思想带到同一张桌面。', note: '书本、封面和纸张并置成一个小型档案。照片没有强调某一本书，而是呈现阅读作为一种生活痕迹：知识被拿起、放下，又等待下一次打开。' },
  { slug: 'photo-09-bridge-haze', number: '09', title: '桥在雾里', englishTitle: 'Bridge in Haze', chapter: 'water', ...image('IMG20250212152845.jpg', 4096, 3072), alt: '雾气中的大桥横跨水面。', short: '桥把两岸连接起来，却无法穿透天气的沉默。', note: '长桥的几何线条与灰蓝雾气形成对照。工程的明确目的在自然湿度中变得朦胧，连接仍然存在，但抵达不再是理所当然。' },
  { slug: 'photo-10-water-walker', number: '10', title: '水上的人', englishTitle: 'Figure on Water', chapter: 'water', ...image('IMG20250213173005.jpg', 3072, 4096), alt: '一名人物站在雾气弥漫的水面或堤岸上。', short: '一个人站在水与天空尚未分开的地方。', note: '人物被放在宽阔浅色空间的边缘，轮廓小而孤独。水面反光消解了地面感，使他像站在现实与倒影之间，等待世界重新显形。' },
  { slug: 'photo-11-window-sky', number: '11', title: '窗里有天', englishTitle: 'Sky Through a Window', chapter: 'daily', ...image('IMG20250316104753.jpg', 3072, 4096), alt: '室内暗处的窗框里映出天空与树枝。', short: '一扇窗把外面的光剪成一幅小画。', note: '深色室内与明亮窗框形成强烈反差。窗不是单纯的出口，也是一种观看装置：我们从被遮蔽的位置确认世界仍在外面继续。' },
  { slug: 'photo-12-leaf-and-wire', number: '12', title: '叶与电线', englishTitle: 'Leaf Against the Wire', chapter: 'daily', ...image('IMG20250503171701.jpg', 3072, 4096), alt: '树叶、枝条与城市电线交叠在天空中。', short: '自然的叶脉与城市的线路在同一片天空上交叉。', note: '叶片的柔软轮廓和电线的直线彼此穿插，构成一幅偶然的抽象画。它们都在传递某种东西：一个传递水分与光，一个传递声音与电流。' },
  { slug: 'photo-13-mountain-temple', number: '13', title: '云上的入口', englishTitle: 'Entrance Above the Clouds', chapter: 'daily', ...image('IMG20250627163823.jpg', 3264, 2448), alt: '云雾中的山峰与山顶建筑。', short: '山顶建筑像从云里暂时浮出的记忆。', note: '山体被云雾切成若隐若现的层次，建筑成为人类尺度的微小标记。照片没有把登顶当作征服，而更像一次被天气允许的短暂相遇。' },
  { slug: 'photo-14-blue-hour', number: '14', title: '蓝色时刻', englishTitle: 'Blue Hour', chapter: 'daily', ...image('IMG20250705050755.jpg', 3072, 4096), alt: '深蓝天空与树的剪影。', short: '天还没有完全黑，世界先学会了沉默。', note: '大片蓝色天空承接右下角树影，画面几乎没有事件。蓝调时刻的价值正在于过渡：白昼和夜晚都尚未占据全部，情绪也因此保留开放性。' },
  { slug: 'photo-15-mossy-corner', number: '15', title: '墙角的绿色', englishTitle: 'Green in the Corner', chapter: 'daily', ...image('IMG20250729102954.jpg', 3072, 4096), alt: '旧墙和缝隙中的绿色植物。', short: '植物从建筑的缝隙里取得一小块领地。', note: '粗粝墙面、斜线和一簇绿色形成简洁构图。生命不一定从肥沃土地开始，它也会在被忽略的边角找到足够继续生长的理由。' },
  { slug: 'photo-16-rain-memory', number: '16', title: '雨后记忆', englishTitle: 'Memory After Rain', chapter: 'trace', ...image('IMG20251231123615.jpg', 3072, 4096), alt: '雨后灰色水面、树木与倒影。', short: '雨把城市的边缘变得柔软，记忆也随之回潮。', note: '灰色天空、水洼与远处树影几乎融成一层，暗处的圆形物体像一枚未说完的句号。画面不追求清晰叙事，而保留雨后情绪的迟缓与回声。' },
  { slug: 'photo-17-tide-rock', number: '17', title: '潮汐的手稿', englishTitle: 'Tide Manuscript', chapter: 'trace', ...image('IMG20260128174250.jpg', 4096, 3072), alt: '海水冲刷岩石形成的蓝色纹理。', short: '海水在岩石上反复书写同一段句子。', note: '蓝色海水、白色浪花和褐色岩石形成强烈触感。每一次潮汐都改变线条，却从不留下最终版本；自然的时间因此像一本永远在修改的手稿。' },
  { slug: 'photo-18-birds-horizon', number: '18', title: '海平线上的鸟', englishTitle: 'Birds on the Horizon', chapter: 'trace', ...image('IMG20260129142000.jpg', 4096, 3072), alt: '海面、远处船只与飞鸟。', short: '飞鸟把平静海面切出几处移动的标点。', note: '灰色海面占据大部分画幅，飞鸟与远船成为极小的动态符号。它们让辽阔不再是静止背景，而变成每个生命都在其中留下短暂轨迹的场所。' },
  { slug: 'photo-19-harbor-light', number: '19', title: '港口的白光', englishTitle: 'White Light at the Harbor', chapter: 'trace', ...image('IMG20260129144048.jpg', 4096, 3072), alt: '港口建筑、船只与浅色海面。', short: '港口把远方压缩成几艘停泊的船。', note: '浅色海面与港口建筑构成低调的城市肖像。船只没有出发也没有抵达，停泊本身成为一种状态：人在移动世界中也需要暂时靠岸。' },
  { slug: 'photo-20-harbor-boats', number: '20', title: '船与船之间', englishTitle: 'Between Boats', chapter: 'trace', ...image('IMG20260129144054.jpg', 4096, 3072), alt: '多艘船只停在港湾水面。', short: '不同方向的船，在同一片水上共享安静。', note: '船只错落分布，远近关系让画面形成一种缓慢呼吸。它们像互不相识的人，各自带着目的停靠，却暂时共享同一片没有边界的水。' },
  { slug: 'photo-21-roof-garden', number: '21', title: '屋檐下的山', englishTitle: 'Mountain Under the Eaves', chapter: 'daily', ...image('IMG20260617131820.jpg', 3072, 4096), alt: '传统屋檐、山林与绿意交叠。', short: '屋檐把远山框成一幅日常的画。', note: '瓦檐的节奏与远处山林形成层层遮挡，传统建筑不再只是历史物件，而是观看自然的一种框架。' },
  { slug: 'photo-22-lush-valley', number: '22', title: '绿色深处', englishTitle: 'Into the Green', chapter: 'daily', ...image('IMG20260620125416.jpg', 3072, 4096), alt: '浓密树木与山谷中的绿色景观。', short: '绿色没有尽头，只有不同深度的呼吸。', note: '树冠和山坡不断叠加，视线无法找到明确终点。照片让“自然”不再是一个对象，而是一种会把人慢慢包围的感知环境。' },
  { slug: 'photo-23-pond-reflection', number: '23', title: '池水记得', englishTitle: 'The Pond Remembers', chapter: 'water', ...image('IMG20260620125610.jpg', 3072, 4096), alt: '安静池水中的树木倒影。', short: '水面保存了一份比现实更慢的风景。', note: '倒影把树、岸边和天空重新排列，真实景物反而退到画外。水不是复制现实，而是用波纹替它保留一份会变化的记忆。' },
  { slug: 'photo-24-garden-steps', number: '24', title: '向上的小路', englishTitle: 'Steps Upward', chapter: 'daily', ...image('IMG20260620130045.jpg', 3072, 4096), alt: '绿色花园中通向上方的石阶。', short: '石阶藏在植物之间，像一条被时间保留下来的邀请。', note: '台阶、树影和修剪过的灌木共同形成引导线。它没有宏大目的，只把人从低处带到高处；日常的方向感往往就是这样被一点点建立。' },
  { slug: 'photo-25-building-light', number: '25', title: '楼与光的缝隙', englishTitle: 'A Gap Between Buildings', chapter: 'trace', ...image('IMG_20241109_074033.jpg', 3072, 4096), alt: '高楼、玻璃和树枝之间的光线。', short: '城市的垂直线条为天空留下窄窄的呼吸口。', note: '建筑立面把画面切成硬朗几何，细小树枝从边缘伸入，提醒我们城市从未完全隔绝自然。光线穿过缝隙，也穿过生活的密度。' },
  { slug: 'photo-26-tower-blocks', number: '26', title: '被雾压低的楼', englishTitle: 'Buildings Beneath the Haze', chapter: 'trace', ...image('IMG_20241109_074941.jpg', 3269, 2037), alt: '雾气中的高层住宅楼。', short: '高楼在雾里失去高度，城市暂时变得平等。', note: '高层建筑向上延伸，却被白雾截断顶部。人的尺度、城市的雄心和天气的力量在这里短暂相遇。' },
  { slug: 'photo-27-autumn-tree', number: '27', title: '一棵树的秋天', englishTitle: 'Autumn, Held by One Tree', chapter: 'trace', ...image('IMG_20241204_075035.jpg', 2912, 3884), alt: '一棵橙红色秋树立在建筑之间。', short: '一棵树把整座街区的季节集中到自己身上。', note: '橙红树冠与灰白建筑形成清晰色块。树既是自然的主体，也是城市时间的钟面：它用颜色告诉经过的人，季节已经走到这里。' },
  { slug: 'photo-28-crossing-car', number: '28', title: '路口的蓝色', englishTitle: 'Blue at the Crossing', chapter: 'trace', ...image('IMG_20241221_172631.jpg', 2500, 2374), alt: '从高处俯拍道路、蓝色车辆与交通标线。', short: '一辆蓝车在规则线条中留下短暂偏差。', note: '道路标线、阴影和车辆形成抽象构图。车辆看似被城市规则引导，却仍携带个体行程；俯视角度让日常交通像一张不断变化的几何图。' },
  { slug: 'photo-29-mountain-road', number: '29', title: '山的褶皱', englishTitle: 'Folds of the Mountain', chapter: 'desert', ...image('IMG_20250517_155328.jpg', 3072, 4096), alt: '云雾中的山峰与山路。', short: '山脉像一块被雾反复折叠的布。', note: '灰蓝山体没有明确轮廓，只有层层褶皱向远处退去。道路与山势的细小关系让宏大景观重新获得人的进入尺度。' },
  { slug: 'photo-30-night-structure', number: '30', title: '夜里的骨架', englishTitle: 'Skeleton of the Night', chapter: 'daily', ...image('IMG_20250626_230204.jpg', 3072, 4096), alt: '夜色中被灯光照亮的高大金属结构。', short: '黑夜把结构的骨架和一盏灯留在一起。', note: '深色天空几乎吞没建筑，只留下金属结构与底部暖光。照片把庞大物体转译成线条，像在提醒：城市的力量也依赖无数细小连接。' },
  { slug: 'photo-31-blue-tower', number: '31', title: '塔与蓝天', englishTitle: 'Tower into Blue', chapter: 'daily', ...image('IMG_20250706_203429.jpg', 3072, 4096), alt: '蓝天下的通信塔与树影。', short: '塔把人造的信号送进一片无边蓝色。', note: '通信塔的垂直线与天空形成极简构图，树影从边缘进入，连接技术与自然。看不见的信号因此获得了一个可见的方向。' },
  { slug: 'photo-32-dark-window', number: '32', title: '黑窗之后', englishTitle: 'Beyond the Dark Window', chapter: 'daily', ...image('IMG_20250706_210309.jpg', 3072, 4096), alt: '夜色中的建筑窗户与微弱灯光。', short: '一扇黑窗把“有人在里面”变成一种猜想。', note: '建筑轮廓在夜里几乎消失，只剩窗户和微弱反光。照片不展示室内故事，而把想象交给观众：每个不透明的窗，背后都可能有另一种生活。' },
  { slug: 'photo-33-evening-road', number: '33', title: '晚风经过', englishTitle: 'When Evening Wind Passes', chapter: 'water', ...image('IMG_20250709_200703.jpg', 3072, 4096), alt: '傍晚道路、树木与远处天空。', short: '道路在暮色里变成一条缓慢流动的河。', note: '金色天光落在道路和树梢，画面中心的路径把视线带向远方。它记录的不是目的地，而是一天结束时人仍愿意继续向前的轻微心情。' },
  { slug: 'photo-34-between-buildings', number: '34', title: '楼群之间的天空', englishTitle: 'Sky Between Blocks', chapter: 'trace', ...image('IMG_20250730_183440.jpg', 3072, 4096), alt: '高楼之间抬头可见的一小片天空。', short: '城市把天空切窄，却没有彻底拿走它。', note: '两侧高楼像峡谷墙面，树枝和蓝天从中间露出。仰视动作让狭窄空间产生开口，也让“自由”变成一个需要主动寻找的角度。' },
  { slug: 'photo-35-autumn-avenue', number: '35', title: '秋日长廊', englishTitle: 'Autumn Aisle', chapter: 'daily', ...image('IMG_20251105_132806.jpg', 1719, 2435), alt: '秋天树木围合出的林荫道路。', short: '树冠把普通道路变成一条金色长廊。', note: '道路的透视线向远处收束，两侧树木像拱廊般围合。人被放在季节构成的通道里，前方没有戏剧事件，只有继续走下去的安静邀请。' },
  { slug: 'photo-36-shoreline-figures', number: '36', title: '岸边的剪影', englishTitle: 'Silhouettes by the Shore', chapter: 'water', ...image('IMG_20260128_091510.jpg', 3004, 4002), alt: '黄昏水岸边的电线杆、人物与反光。', short: '几个人影站在岸边，像在等待同一束光。', note: '低处的水面反光、竖直电线杆和远方人物构成简洁秩序。每个人都很小，却共同把黄昏从风景变成了有人在场的时间。' },
  { slug: 'photo-37-reflected-desert', number: '37', title: '沙丘的倒影', englishTitle: 'Desert Reflected', chapter: 'desert', ...image('IMG_20260510_103008.jpg', 4096, 2304), alt: '沙漠、浅水与远处成群动物的倒影。', short: '沙漠在水里看见自己的另一张脸。', note: '暖色沙丘与浅水倒影几乎对称，远处的动物成为细小移动线索。干燥与湿润、真实与倒影在一张照片里互相校正。' },
  { slug: 'photo-38-cloud-study', number: '38', title: '云的练习', englishTitle: 'Study of Clouds', chapter: 'water', ...image('IMG_20260815_181852.jpg', 2662, 3562), alt: '蓝天中层叠的白色云层。', short: '云把天空变成一张不断改稿的纸。', note: '白云的边缘柔软而不稳定，蓝色背景提供唯一秩序。照片让短暂天气成为主体，也让观看从物体转向变化本身。' },
  { slug: 'photo-39-river-line', number: '39', title: '混凝土也能看海', englishTitle: 'The Sea on Concrete', chapter: 'water', ...image('IMG_20260818_094403.png', 1086, 1448), alt: '水泼在深色混凝土地面上，泡沫和水痕形成海浪冲刷沙滩般的形状。', short: '一盆水落在混凝土上，泡沫沿地面铺开，普通墙角突然有了海岸线。', note: '照片拍摄的是被水泼湿的混凝土地面。白色泡沫沿水流边缘聚集，细长水痕像退潮后留在沙滩上的浪线；深灰粗糙表面则被视觉经验暂时误认成潮湿海滩。作品不是模拟真正的海，而是在说明观看如何改变地点：只要光、水和想象相遇，混凝土也能短暂拥有一片海。' },
  { slug: 'photo-40-framed-landscape', number: '40', title: '四个窗口', englishTitle: 'Four Windows', chapter: 'trace', ...image('IMG_20260818_095756.jpg', 4096, 3072), alt: '室内暗处排列着四个明亮窗框，窗外是树木景色。', short: '四个窗口把同一片自然切成四种观看。', note: '黑暗室内像一张巨大的底片，四个窗框分别截取树木、天空与远景。观看不是一次性拥有全景，而是通过有限框架不断拼合世界。' },
  { slug: 'photo-41-roof-and-hill', number: '41', title: '屋后青山', englishTitle: 'Green Hill Behind the Roof', chapter: 'daily', ...image('IMG_20260818_100406.jpg', 3072, 4096), alt: '屋顶、白墙与屋后的绿色山坡。', short: '一面白墙把山的绿色托得更亮。', note: '建筑的几何边缘和山坡的自然曲线相互咬合。照片没有把乡村浪漫化，而是呈现居住空间与山林相互依靠的日常关系。' },
  { slug: 'photo-42-window-mountain', number: '42', title: '窗外的旧楼', englishTitle: 'Old Building Beyond the Window', chapter: 'trace', ...image('IMG_20260818_113921.jpg', 3072, 4096), alt: '窗框中的旧建筑和远处山林。', short: '窗框把一座旧楼保存成一段安静的时间。', note: '室内暗部、窗框和外部白墙形成层层框景。旧建筑的纹理与远山同时出现，像把个人生活和地方记忆压缩到一次抬头里。' },
  { slug: 'photo-43-wire-birds', number: '43', title: '电线上的停留', englishTitle: 'Resting on the Wire', chapter: 'trace', ...image('IMG_20260827_091304.jpg', 3072, 2303), alt: '一排鸟停在交错电线上。', short: '鸟把城市线路临时变成一条栖息地。', note: '电线以斜线穿过浅色天空，鸟群成为均匀分布的黑色标点。人造线路与生命停留并不天然和谐，却在这一刻形成了简洁的共同秩序。' },
  { slug: 'photo-44-wire-blue', number: '44', title: '蓝线之间', englishTitle: 'Between Blue Lines', chapter: 'trace', ...image('IMG_20260827_091402.jpg', 3072, 2303), alt: '蓝天与电线上的小鸟。', short: '几条线把蓝天分割，也把远处的鸟连接起来。', note: '蓝色天空占据画面，电线提供明确方向，鸟只在节点处短暂停留。照片把自由与秩序放在同一张图里：飞翔并不总要脱离线条。' },
  { slug: 'photo-45-birds-pole', number: '45', title: '风向标', englishTitle: 'Weather Vane', chapter: 'trace', ...image('IMG_20260827_092132.jpg', 4096, 3072), alt: '鸟群、电线杆和斜向电线组成的天空构图。', short: '鸟群与电线杆一起测量看不见的风。', note: '密集鸟点、斜线和电线杆形成具有节奏的抽象构图。每只鸟都很小，但它们的朝向让天空出现了集体情绪。' },
  { slug: 'photo-46-yellow-wires', number: '46', title: '黄昏线路', englishTitle: 'Lines at Dusk', chapter: 'trace', ...image('IMG_20260827_092203.jpg', 4096, 3072), alt: '夕阳下的电线、鸟群与黄色天空。', short: '黄昏把电线染成一组温柔的五线谱。', note: '黄色天空、黑色电线和鸟群形成平面化构图。线路不再只是基础设施，而像一段等待被听见的旋律，承载着迁徙、停留和日常声响。' },
  { slug: 'photo-47-rainbow', number: '47', title: '雨后的弧线', englishTitle: 'Arc After Rain', chapter: 'water', ...image('IMG_20260828_181044.jpg', 3072, 4096), alt: '雨后天空出现彩虹，地面有树木与建筑。', short: '彩虹把一场天气写成短暂的公共消息。', note: '彩虹横跨浅蓝天空，地面建筑与树影保持日常尺度。它不是永恒景观，正因为即将消失，才让路过的人同时抬头，分享几分钟的惊奇。' },
  { slug: 'photo-48-books-and-memory', number: '48', title: '书页之间', englishTitle: 'Between the Pages', chapter: 'daily', ...image('IMG_20260830_084000.jpg', 3072, 4096), alt: '多本书籍和纸张在桌面上铺开。', short: '书页之间堆叠着被阅读过的时间。', note: '书脊、纸张和文字构成一幅生活档案。它们不是静物，而是思想经过手的痕迹；每一本书都让看不见的他人进入房间。' },
  { slug: 'photo-49-withered-sunflower', number: '49', title: '花开到后来', englishTitle: 'After the Bloom', chapter: 'trace', ...image('IMG_20260830_101645.jpg', 4096, 2316), alt: '森林背景前一瓶正在枯萎的向日葵。', short: '花朵正在凋谢，却把森林的绿色带进了室内。', note: '橙色花瓣已经卷曲，透明瓶身和绿色背景让衰败显得清晰而温柔。照片不把枯萎当作失败，而把它看成生命完成一次形态转换的时刻。' },
  { slug: 'photo-50-desert-house', number: '50', title: '沙海中的屋子', englishTitle: 'House in the Sand Sea', chapter: 'desert', ...image('IMG_20260830_101813.jpg', 4096, 3073), alt: '沙漠中的白墙红屋顶小屋，旁边是一棵枯树。', short: '一间小屋在沙海里守住了人曾经生活过的证据。', note: '红屋顶、白墙和枯树成为沙丘中的鲜明符号。房子像被时间留下的容器，既提供庇护，也暴露出人类居所面对辽阔自然时的脆弱。' },
  { slug: 'photo-51-sunrise-tide', number: '51', title: '潮汐的早晨', englishTitle: 'Tide at Sunrise', chapter: 'water', ...image('IMG_20260830_101938.jpg', 3072, 4096), alt: '太阳从海平面升起，潮湿沙滩反射金色光线。', short: '太阳在潮湿沙地上留下了一条可以走进去的光。', note: '太阳、海平线和沙纹构成垂直光路，脚印把抽象的光重新拉回人的经验。每一次日出都相似，却没有一次真正重复。' },
  { slug: 'photo-52-sawn-wood', number: '52', title: '木头的年轮', englishTitle: 'Rings of Wood', chapter: 'trace', ...image('mmexport1788056014880.jpg', 1080, 1440), alt: '堆叠木段的横截面与年轮。', short: '被切开的树木，把时间暴露在圆形截面上。', note: '木段的年轮、裂纹和阴影组成密集纹理。每个圆都曾经向外生长，如今却被堆叠成静物；生命的长度被压缩成可以触摸的图案。' },
  { slug: 'photo-53-roof-edge', number: '53', title: '屋檐与云', englishTitle: 'Roof Edge and Cloud', chapter: 'daily', ...image('mmexport1788056016858.jpg', 1080, 1440), alt: '建筑屋檐、树枝与浅色天空。', short: '屋檐的直线和云的柔软在同一刻相遇。', note: '屋檐切出明确几何边界，云与树枝则不断溢出边界。照片记录的是一个极短的平衡：人造结构和天气各自保持形状，却共同组成画面。' },
  { slug: 'photo-54-wood-stack', number: '54', title: '堆叠的时间', englishTitle: 'Stacked Time', chapter: 'trace', ...image('mmexport1788056018815.jpg', 1080, 1440), alt: '整齐堆叠的木段横截面。', short: '一堆木头像一面由年轮组成的墙。', note: '重复的圆形截面形成近似蜂巢的节奏，纹理越靠近越复杂。它把森林的连续生长转译为人可以搬运、排列和保存的尺度。' },
  { slug: 'photo-55-building-shadow', number: '55', title: '楼影里的蓝', englishTitle: 'Blue in the Building Shadow', chapter: 'trace', ...image('mmexport1788056063557.jpg', 1918, 1080), alt: '高楼阴影、蓝色天空与树木。', short: '建筑阴影把一小片蓝天框得更清楚。', note: '暗色楼体与蓝色天空形成简洁切割，树影在底部提供柔软过渡。城市的重量并未完全遮住天空，只是迫使天空以更窄、更珍贵的方式出现。' },
  { slug: 'photo-56-rose-rain', number: '56', title: '雨里的玫瑰', englishTitle: 'Rose in the Rain', chapter: 'water', ...image('mmexport1788056079501.jpg', 1910, 1080), alt: '雨后绿色植物中的一朵粉色玫瑰。', short: '雨水让一朵玫瑰显得更接近，也更短暂。', note: '粉色花瓣与深绿背景形成温柔对比，水珠把光线聚在花缘。它不是被摆放好的完美花朵，而是处在天气和生长中的真实瞬间。' },
  { slug: 'photo-57-leaf-canopy', number: '57', title: '树下仰望', englishTitle: 'Looking Up Through Leaves', chapter: 'daily', ...image('mmexport1788056123270.jpg', 1440, 1080), alt: '从树下仰望树冠与蓝天。', short: '树冠把天空剪成几块会移动的蓝色。', note: '深色枝叶从四周围拢，蓝天只在缝隙中出现。仰视让树成为一座临时穹顶，也让人重新意识到自己正在被更大的生命结构包围。' },
  { slug: 'photo-58-green-mountain', number: '58', title: '山的晴面', englishTitle: 'The Clear Face of the Mountain', chapter: 'desert', ...image('mmexport1788056127992.jpg', 1080, 1440), alt: '阳光下的绿色山坡与岩石。', short: '岩石前景把绿色山坡推向更远的地方。', note: '前景岩面粗粝，远山则呈现明亮而连续的绿色。两种尺度之间没有人物，却保留了身体可以站立、目光可以越过的真实距离。' },
  { slug: 'photo-59-bridge-work', number: '59', title: '墙上的劳动', englishTitle: 'Work Along the Wall', chapter: 'daily', ...image('retouch_2026081810521859.jpg', 3548, 2660), alt: '几名工人在屋顶和脚手架上进行墙面施工。', short: '三个人在不同高度工作，把一面墙慢慢交还给生活。', note: '屋顶、墙面、脚手架和三位工人形成多层横向关系。每个人都在做具体而微小的动作，建筑因此不再是完成品，而成为持续被修补的共同生活。' },
  { slug: 'photo-60-butterfly-wall', number: '60', title: '墙上的蝶', englishTitle: 'Butterfly on the Wall', chapter: 'trace', ...image('retouch_2026081811080477.jpg', 1447, 1111), alt: '一只蝴蝶停在浅色墙面上。', short: '蝴蝶把一面空墙变成了短暂的花园。', note: '浅色墙面几乎没有信息，蝴蝶的深色翅膀因此格外清晰。它只停留片刻，却改变了整个空间的观看重心。' },
  { slug: 'photo-61-black-white-building', number: '61', title: '山谷里的白楼', englishTitle: 'White Building in the Valley', chapter: 'daily', ...image('retouch_2026081811164123.jpg', 2660, 3548), alt: '黑白照片中的山谷建筑与一名蓝衣人物。', short: '一抹蓝色把黑白建筑重新拉回今天。', note: '黑白建筑、山林与前景人物构成克制画面，蓝色衣服成为唯一鲜明色彩。它像一个时间坐标，提醒观众这座旧空间仍被当代生活经过。' },
  { slug: 'photo-62-butterfly-close', number: '62', title: '蝶的侧面', englishTitle: 'Butterfly, Side View', chapter: 'trace', ...image('retouch_2026081811321037.jpg', 1448, 1086), alt: '浅色背景上的蝴蝶近景。', short: '翅膀的纹理像一张极小的地图。', note: '蝴蝶被从环境中单独取出，翅面颜色和细小纹理成为全部叙事。越靠近看，生命越不像符号，而像一套复杂、脆弱的结构。' },
  { slug: 'photo-63-roof-sky', number: '63', title: '屋顶线', englishTitle: 'Roofline', chapter: 'daily', ...image('retouch_2026081816234218.jpg', 2660, 3548), alt: '屋顶边缘、蓝灰天空与细小树枝。', short: '屋顶把天空压成一条安静的斜线。', note: '建筑屋顶、天空和树枝构成极简几何关系。没有人物出现，生活却通过屋顶的边缘被暗示：这里有人建造、居住，也有人曾抬头看过同一片天。' },
  { slug: 'photo-64-glass-reflection', number: '64', title: '玻璃里的树林', englishTitle: 'Forest in Glass', chapter: 'trace', ...image('synthesis_51ffcabb-f239-4974-a407-37ff2c93c445_image_save_local1787025779974.jpg', 3128, 2160), alt: '玻璃建筑反射出蓝天、树木与周围空间。', short: '玻璃把外部树林和内部建筑叠在同一层。', note: '蓝色玻璃幕墙反射天空与树木，也透露出建筑内部的结构。自然与城市不是两张互不相干的图，而是在反光表面上不断重合。' },
  { slug: 'photo-65-pink-salt', number: '65', title: '粉色地平线', englishTitle: 'Pink Horizon', chapter: 'desert', ...image('synthesis_bc98693e-2555-49d1-9d3f-0da2e8d1207b_image_save_local1778386127948.jpg', 3264, 1836), alt: '粉白色盐湖或沙地与蓝色天空形成宽阔地平线。', short: '粉色地面把远方变成一条几乎没有重量的线。', note: '大面积浅粉、白与蓝构成极简风景，地平线像被擦淡。照片不提供明确地点，只提供一种悬浮感：人在世界上，却暂时没有被固定。' },
];

export const photographyChapters: PhotoChapter[] = [
  { id: 'desert', number: '01', label: '第一章', english: 'LAND / DISTANCE', title: '旷野的边界', intro: '从沙丘、盐地到远山，风景先把人的尺度放小，再把目光放远。', works: allWorks.filter(w => w.chapter === 'desert') },
  { id: 'water', number: '02', label: '第二章', english: 'WATER / WEATHER', title: '水的记忆', intro: '雾、潮汐、倒影与雨，把正在发生的世界变成一份会变化的记忆。', works: allWorks.filter(w => w.chapter === 'water') },
  { id: 'daily', number: '03', label: '第三章', english: 'EVERYDAY / LIGHT', title: '日常的光', intro: '屋檐、窗、树、道路与劳动，在平凡处显出生活最持久的纹理。', works: allWorks.filter(w => w.chapter === 'daily') },
  { id: 'trace', number: '04', label: '第四章', english: 'TRACE / AFTERIMAGE', title: '留下之后', intro: '鸟、木头、建筑、蝴蝶与地平线，记录事物离开之后仍留在眼中的痕迹。', works: allWorks.filter(w => w.chapter === 'trace') },
];

export const photographyWorks = photographyChapters.flatMap(chapter => chapter.works);

export function getPhotographyWork(slug: string) {
  return photographyWorks.find(work => work.slug === slug);
}
