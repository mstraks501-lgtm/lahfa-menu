import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as menuStorage from "./menu-storage";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Menu API endpoints
  menu: router({
    // Get all categories
    getCategories: publicProcedure.query(() => {
      return menuStorage.getCategories();
    }),

    // Get all items
    getItems: publicProcedure.query(() => {
      return menuStorage.getItems();
    }),

    // Get items by category
    getItemsByCategory: publicProcedure
      .input(z.object({ categoryId: z.string() }))
      .query(({ input }) => {
        return menuStorage.getItemsByCategory(input.categoryId);
      }),

    // Update item (admin)
    updateItem: publicProcedure
      .input(z.object({
        id: z.string(),
        categoryId: z.string(),
        name: z.string(),
        nameAr: z.string(),
        nameEn: z.string().nullable().optional().default(''),
        price: z.number(),
        description: z.string().nullable().optional().default(''),
        descriptionAr: z.string().nullable().optional().default(''),
        descriptionEn: z.string().nullable().optional().default(''),
        image: z.string().nullable().optional().default(''),
      }))
      .mutation(({ input }) => {
        // Convert null to empty string
        const cleanedInput = {
          ...input,
          nameEn: input.nameEn || '',
          description: input.description || '',
          descriptionAr: input.descriptionAr || '',
          descriptionEn: input.descriptionEn || '',
          image: input.image || '',
        };
        return menuStorage.upsertItem(cleanedInput as any);
      }),

    // Delete item (admin)
    deleteItem: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => {
        const success = menuStorage.deleteItem(input.id);
        return { success };
      }),

    // Get all menu data
    getAllData: publicProcedure.query(() => {
      return menuStorage.readMenuData();
    }),
  })
});

export type AppRouter = typeof appRouter;
