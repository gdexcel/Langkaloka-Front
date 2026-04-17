# Product Listing & Detail Fix for Multi Images

## Steps:

1. ✅ Plan confirmed
2. ✅ Fix `/api/seller/products/route.ts` - GROUP BY product.id or subquery first image
3. ✅ Fix `/api/products/route.ts` - same for public listings
4. ✅ Add/update `/api/products/[id]/route.ts` - return product + images array
5. ✅ Update `app/product/[id]/page.tsx` - show images gallery/carousel
6. ✅ Test listings no duplicates, detail shows all images
7. Complete
