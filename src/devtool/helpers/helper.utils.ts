/**
 * 删除不可序列化的属性
 */
export function removeUnserializableProps(object: any) {
  const obj = { ...object };

  for (const key in obj) {
    if (typeof obj[key] === "function") {
      delete obj[key];
    }
  }

  return obj;
}
