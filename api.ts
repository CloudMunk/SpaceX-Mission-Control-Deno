import { Router} from "./deps.ts";

import * as planets from "./models/planets.ts";
import * as launches from "./models/launches.ts";
import { Launch } from "./models/launches.ts";

const router = new Router();

router.get("/", (ctx) => {
    ctx.response.body = `
    #     #    #     #####     #    
    ##    #   # #   #     #   # #   
    # #   #  #   #  #        #   #  
    #  #  # #     #  #####  #     # 
    #   # # #######       # ####### 
    #    ## #     # #     # #     # 
    #     # #     #  #####  #     # 
                    Mission Control API`;
});

router.get("/planets", (ctx) => {
    ctx.response.body = planets.getAllPlanets();
})

router.get("/launches", (ctx) => {
    ctx.response.body = launches.getAll();
})
// Get specific Launch
router.get("/launches/:id", (ctx) => {
    if(ctx.params?.id) {
        const launchesList = launches.getOne(Number(ctx.params.id));
        if(launchesList) {
            ctx.response.body = launchesList
        } else {
            ctx.throw(400, "Launch with that ID doesn't exist")
        } 
    } 
})

router.delete("/launches/:id", (ctx) => {
    if(ctx.params?.id) {
        const result = launches.removeOne(Number(ctx.params.id));
        ctx.response.body = { success: result }
    }
})

// post
router.post("/launches", async (ctx) => {
    const result = ctx.request.body();
    const data: Launch = await result.value;
    launches.addOne(data);

    ctx.response.body = { success: true };
    ctx.response.status = 201;
});

export default router;