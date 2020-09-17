package io.inugami.plugins.dashboard.demo.rest;

import java.io.File;
import java.io.IOException;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import io.inugami.api.loggers.Loggers;
import io.inugami.commons.files.FilesUtils;
import io.inugami.configuration.models.plugins.Plugin;
import io.inugami.core.context.ApplicationContext;
import io.inugami.core.security.commons.roles.UserConnected;

@Path("plugins/inugami-plugin-dashboard-demo/healthCheckData")
public class HealthCheckDataRest {
    // =========================================================================
    // ATTRIBUTES
    // =========================================================================
    @Inject
    private ApplicationContext context;
    
    // =========================================================================
    // METHODS
    // =========================================================================
    @GET
    @UserConnected
    @Produces(MediaType.APPLICATION_JSON)
    public Response getConnectors() throws IOException {
        final String fileName = "health.check.connectors.json";
        String content = null;
        try {
            content = resolveFile(fileName);
        }
        catch (final IOException e) {
            Loggers.PLUGINS.error("can't read file : {}", fileName);
            throw e;
        }
        
        return Response.status(Response.Status.OK).entity(content).build();
    }
    
    // =========================================================================
    // TOOLS
    // =========================================================================
    private String resolveFile(final String fileName) throws IOException {
        String content = null;
        if (context.isDevMode()) {
            content = resolveFromWorkspace(fileName);
        }
        else {
            content = FilesUtils.readFileFromClassLoader(String.join("/", "META-INF", "mock", fileName));
        }
        return content;
    }
    
    private String resolveFromWorkspace(final String fileName) throws IOException {
        String result = null;
        final Plugin currentPlugin = context.getPlugin("io.inugami.plugins", "inugami-plugin-dashboard-demo");
        
        //@formatter:off
        if ((currentPlugin != null) && (currentPlugin.getManifest() != null)  && (currentPlugin.getManifest().getWorkspace() != null)) {
            final File path = FilesUtils.buildFile(currentPlugin.getManifest().getWorkspace(),
                                                   "src", "main","resources", "META-INF", "mock", fileName);
            //@formatter:on
            result = FilesUtils.readContent(path);
        }
        
        return result;
    }
    
}
