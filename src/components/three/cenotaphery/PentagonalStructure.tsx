'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'
import {
  WALL_THICKNESS,
  LEVEL_HEIGHT,
  NICHE_WIDTH,
  NICHE_DEPTH,
  NICHE_HEIGHT,
  PARTITION_WIDTH,
  INNER_RADIUS,
  NICHES_PER_WALL,
} from './config'

/**
 * КЕНОТАФАРИЙ - ОДИН УРОВЕНЬ (3D) - CSG ПОДХОД
 *
 * Логика:
 * 1. Создаём СПЛОШНОЙ пятиугольный кольцевой цилиндр (от innerRadius до outerRadius)
 * 2. Вычитаем из него боксы ниш
 * 3. Результат = стены с нишами, у которых есть пол и потолок
 *
 * РАЗМЕРЫ НИШИ:
 * - Ширина: NICHE_WIDTH = 2.0м
 * - Высота: NICHE_HEIGHT = 2.5м
 * - Глубина: NICHE_DEPTH = 3.0м
 * - Пол: (LEVEL_HEIGHT - NICHE_HEIGHT) / 2 = 0.25м
 * - Потолок: 0.25м (одновременно пол следующего уровня)
 */

// ============================================
// ТЕСТОВЫЕ ПАРАМЕТРЫ (5 ниш на сторону)
// ============================================

const TEST_NICHES_PER_WALL = 5

// Вычисляем размеры для тестовой сцены
const TEST_WALL_LENGTH = TEST_NICHES_PER_WALL * NICHE_WIDTH + (TEST_NICHES_PER_WALL + 1) * PARTITION_WIDTH
// = 5 × 2.0 + 6 × 0.5 = 10 + 3 = 13м

const TEST_INNER_RADIUS = TEST_WALL_LENGTH / (2 * Math.sin(Math.PI / 5))
// = 13 / 1.176 ≈ 11.05м

// Отступ пола/потолка ниши от границ уровня
const NICHE_FLOOR_OFFSET = (LEVEL_HEIGHT - NICHE_HEIGHT) / 2 // 0.25м

// ============================================
// ГЕОМЕТРИЧЕСКИЕ ВЫЧИСЛЕНИЯ
// ============================================

/**
 * Вершины правильного пятиугольника
 */
function getPentagonVertices(radius: number): THREE.Vector2[] {
  const vertices: THREE.Vector2[] = []
  for (let i = 0; i < 5; i++) {
    // Начинаем с вершины направленной вверх (на -Y в 2D = "север")
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
    vertices.push(new THREE.Vector2(
      radius * Math.cos(angle),
      radius * Math.sin(angle)
    ))
  }
  return vertices
}

/**
 * Направление НАРУЖУ от стены — перпендикуляр к стене, направленный от центра
 * Это направление, в котором углубляются ниши
 */
function getWallOutwardNormal(vertices: THREE.Vector2[], wallIndex: number): THREE.Vector2 {
  const v1 = vertices[wallIndex]
  const v2 = vertices[(wallIndex + 1) % 5]
  const dx = v2.x - v1.x
  const dy = v2.y - v1.y

  // Два возможных перпендикуляра к стене
  const perp1 = new THREE.Vector2(-dy, dx).normalize()
  const perp2 = new THREE.Vector2(dy, -dx).normalize()

  // Середина стены — используем для определения направления "наружу"
  const wallMid = new THREE.Vector2((v1.x + v2.x) / 2, (v1.y + v2.y) / 2)

  // Выбираем перпендикуляр, который направлен ОТ центра (dot > 0 с wallMid)
  if (perp1.dot(wallMid) > 0) {
    return perp1
  } else {
    return perp2
  }
}

/**
 * Создаёт Shape для сплошного пятиугольного кольца (вид сверху)
 * Без ниш - просто внешний пятиугольник с внутренним отверстием
 */
function createSolidPentagonRingShape(innerRadius: number): THREE.Shape {
  // Для пятиугольника: апофема = R * cos(36°)
  // outerRadius * cos(36°) = innerRadius * cos(36°) + WALL_THICKNESS
  // outerRadius = innerRadius + WALL_THICKNESS / cos(36°)
  const cos36 = Math.cos(Math.PI / 5)
  const outerRadius = innerRadius + WALL_THICKNESS / cos36

  // Внешний контур - простой пятиугольник
  const outerVerts = getPentagonVertices(outerRadius)
  const shape = new THREE.Shape()
  shape.moveTo(outerVerts[0].x, outerVerts[0].y)
  for (let i = 1; i < 5; i++) {
    shape.lineTo(outerVerts[i].x, outerVerts[i].y)
  }
  shape.closePath()

  // Внутренний контур (отверстие) - тоже простой пятиугольник
  const innerVerts = getPentagonVertices(innerRadius)
  const hole = new THREE.Path()
  hole.moveTo(innerVerts[0].x, innerVerts[0].y)
  for (let i = 1; i < 5; i++) {
    hole.lineTo(innerVerts[i].x, innerVerts[i].y)
  }
  hole.closePath()
  shape.holes.push(hole)

  return shape
}

/**
 * Создаёт геометрию для сплошной пятиугольной стены (один уровень)
 *
 * Shape в плоскости XY, ExtrudeGeometry выдавливает по +Z
 * После rotateX(-PI/2): Y->-Z, Z->Y
 * Значит Shape XY становится X(-Z), выдавливание идёт по +Y
 *
 * Координаты боксов тоже нужно трансформировать:
 * - 2D (x, y) в Shape -> 3D (x, -z) после поворота
 * - Но мы хотим (x, y_height, z) где z = 2D_y
 *
 * Решение: НЕ поворачиваем стену, работаем в XY плоскости
 * Боксы тоже в XY плоскости, выдавливание по Z = высота
 */
function createSolidWallGeometry(innerRadius: number): THREE.BufferGeometry {
  const shape = createSolidPentagonRingShape(innerRadius)

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: LEVEL_HEIGHT,
    bevelEnabled: false,
  }

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  // НЕ поворачиваем - работаем в плоскости XY, высота по Z

  return geo
}

/**
 * Генерирует параметры всех ниш для одного уровня
 *
 * Работаем в плоскости XY (как Shape), высота по Z
 * BoxGeometry: X = ширина, Y = глубина (наружу), Z = высота
 */
interface NicheParams {
  position: THREE.Vector3  // центр бокса в 3D (x, y, z) где z = высота
  rotationZ: number        // угол поворота вокруг Z (вертикальной оси)
}

function generateNicheParams(innerRadius: number, nichesPerWall: number): NicheParams[] {
  const niches: NicheParams[] = []
  const innerVerts = getPentagonVertices(innerRadius)

  for (let wallIndex = 0; wallIndex < 5; wallIndex++) {
    const wallStart = innerVerts[wallIndex]
    const wallEnd = innerVerts[(wallIndex + 1) % 5]

    // Направление вдоль стены (в 2D: x, y)
    const wallDir = new THREE.Vector2(
      wallEnd.x - wallStart.x,
      wallEnd.y - wallStart.y
    ).normalize()

    // Направление наружу (в сторону внешнего контура)
    const outwardNormal = getWallOutwardNormal(innerVerts, wallIndex)

    // Угол поворота вокруг Z (вертикальной оси в нашей системе координат):
    // BoxGeometry: X = ширина, Y = глубина
    // По умолчанию Y бокса направлен по +Y (0, 1)
    // Нам нужно повернуть так, чтобы Y бокса смотрел в направлении outwardNormal
    // Угол вектора outwardNormal = atan2(y, x) (стандартная формула)
    // Угол оси +Y = atan2(1, 0) = PI/2
    // Нужный поворот = угол_outward - PI/2
    const outwardAngle = Math.atan2(outwardNormal.y, outwardNormal.x)
    const rotationZ = outwardAngle - Math.PI / 2

    let currentPos = PARTITION_WIDTH // начинаем после первой перегородки

    for (let nicheIndex = 0; nicheIndex < nichesPerWall; nicheIndex++) {
      // Центр ниши вдоль стены
      const nicheCenterAlongWall = currentPos + NICHE_WIDTH / 2

      // Позиция на внутреннем контуре (в 2D)
      const posOnInner = new THREE.Vector2(
        wallStart.x + wallDir.x * nicheCenterAlongWall,
        wallStart.y + wallDir.y * nicheCenterAlongWall
      )

      // Центр бокса ниши сдвинут наружу на половину глубины
      const nicheCenter2D = new THREE.Vector2(
        posOnInner.x + outwardNormal.x * (NICHE_DEPTH / 2),
        posOnInner.y + outwardNormal.y * (NICHE_DEPTH / 2)
      )

      // Z позиция - центр ниши по высоте (с учётом пола)
      const zPos = NICHE_FLOOR_OFFSET + NICHE_HEIGHT / 2

      // 3D координаты: X, Y из 2D, Z = высота
      niches.push({
        position: new THREE.Vector3(nicheCenter2D.x, nicheCenter2D.y, zPos),
        rotationZ,
      })

      currentPos += NICHE_WIDTH + PARTITION_WIDTH
    }
  }

  return niches
}

/**
 * Создаёт трансформированную геометрию бокса для ниши
 * Применяем поворот и позицию напрямую к вершинам геометрии
 *
 * В нашей системе координат (XY плоскость, Z вверх):
 * - BoxGeometry(width, depth, height) = (X, Y, Z)
 * - X = ширина ниши (вдоль стены)
 * - Y = глубина ниши (наружу)
 * - Z = высота ниши (вверх)
 */
function createTransformedNicheGeometry(position: THREE.Vector3, rotationZ: number): THREE.BufferGeometry {
  // X = ширина, Y = глубина, Z = высота
  // Добавляем небольшой запас для надёжного пересечения с CSG
  const EPSILON = 0.01
  const geo = new THREE.BoxGeometry(
    NICHE_WIDTH + EPSILON,
    NICHE_DEPTH + EPSILON,
    NICHE_HEIGHT + EPSILON
  )

  // Создаём матрицы отдельно и перемножаем в правильном порядке
  // Сначала поворот вокруг Z, потом перенос
  const rotationMatrix = new THREE.Matrix4().makeRotationZ(rotationZ)
  const translationMatrix = new THREE.Matrix4().makeTranslation(position.x, position.y, position.z)

  // Порядок: сначала поворот, потом перенос
  // M = T * R означает: сначала R применяется к вершинам, потом T
  const matrix = new THREE.Matrix4().multiplyMatrices(translationMatrix, rotationMatrix)

  // Применяем трансформацию к геометрии
  geo.applyMatrix4(matrix)

  return geo
}

/**
 * Создаёт финальную геометрию уровня: сплошная стена минус ниши
 */
function createLevelWithNichesGeometry(innerRadius: number, nichesPerWall: number): THREE.BufferGeometry {
  const evaluator = new Evaluator()

  // 1. Создаём сплошную стену
  const solidWallGeo = createSolidWallGeometry(innerRadius)
  let result = new Brush(solidWallGeo)
  result.updateMatrixWorld()

  // 2. Генерируем параметры ниш
  const nicheParams = generateNicheParams(innerRadius, nichesPerWall)

  // 3. Вычитаем каждую нишу
  for (const params of nicheParams) {
    // Создаём геометрию с уже применённой трансформацией
    const nicheGeo = createTransformedNicheGeometry(params.position, params.rotationZ)
    const nicheBrush = new Brush(nicheGeo)
    nicheBrush.updateMatrixWorld()

    // Вычитаем
    result = evaluator.evaluate(result, nicheBrush, SUBTRACTION)

    // Освобождаем память
    nicheGeo.dispose()
  }

  // Освобождаем память
  solidWallGeo.dispose()

  return result.geometry
}

// ============================================
// КОМПОНЕНТЫ
// ============================================

interface PentagonLevelProps {
  level: number // 1-8
  innerRadius: number
  nichesPerWall: number
}

function PentagonLevel({ level, innerRadius, nichesPerWall }: PentagonLevelProps) {
  const zPosition = (level - 1) * LEVEL_HEIGHT // Z = высота в нашей системе координат

  // Загружаем металлические текстуры
  const textures = useTexture({
    map: '/textures/Metal047A_1K-JPG/Metal047A_1K-JPG_Color.jpg',
    normalMap: '/textures/Metal047A_1K-JPG/Metal047A_1K-JPG_NormalGL.jpg',
    roughnessMap: '/textures/Metal047A_1K-JPG/Metal047A_1K-JPG_Roughness.jpg',
    metalnessMap: '/textures/Metal047A_1K-JPG/Metal047A_1K-JPG_Metalness.jpg',
  })

  // Настраиваем повторение текстуры
  useMemo(() => {
    Object.values(textures).forEach((texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(8, 2)
    })
  }, [textures])

  const geometry = useMemo(() => {
    return createLevelWithNichesGeometry(innerRadius, nichesPerWall)
  }, [innerRadius, nichesPerWall])

  return (
    <group position={[0, 0, zPosition]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          {...textures}
          color="#C9943D"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
    </group>
  )
}

/**
 * Главный компонент с полными размерами (31 ниша на сторону)
 */
export function PentagonalStructure() {
  return (
    <group>
      <PentagonLevel
        level={1}
        innerRadius={INNER_RADIUS}
        nichesPerWall={NICHES_PER_WALL}
      />
    </group>
  )
}

/**
 * Тестовая структура с 5 нишами на сторону (для отладки)
 */
export function TestPentagonalStructure() {
  return (
    <group>
      <PentagonLevel
        level={1}
        innerRadius={TEST_INNER_RADIUS}
        nichesPerWall={TEST_NICHES_PER_WALL}
      />
    </group>
  )
}

/**
 * Отладочная визуализация - показывает боксы ниш отдельно от стены
 * В системе координат XY (Z вверх)
 */
export function DebugNicheBoxes() {
  const nicheParams = useMemo(() => generateNicheParams(TEST_INNER_RADIUS, TEST_NICHES_PER_WALL), [])

  return (
    <group>
      {nicheParams.map((params, i) => (
        <mesh
          key={i}
          position={params.position}
          rotation={[0, 0, params.rotationZ]}
        >
          {/* X = ширина, Y = глубина, Z = высота */}
          <boxGeometry args={[NICHE_WIDTH, NICHE_DEPTH, NICHE_HEIGHT]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
      ))}
      <axesHelper args={[20]} />
    </group>
  )
}
