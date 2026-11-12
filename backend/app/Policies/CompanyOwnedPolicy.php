<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Database\Eloquent\Model;

/** Shared access rules for resources that persist a company_id. */
class CompanyOwnedPolicy
{
    public function view(User $user, Model $resource): Response
    {
        $company = Company::find($resource->getAttribute('company_id'));

        return $company ? (new CompanyPolicy)->view($user, $company) : Response::denyAsNotFound();
    }

    public function create(User $user, Company $company): Response
    {
        return (new CompanyPolicy)->update($user, $company);
    }

    public function update(User $user, Model $resource): Response
    {
        $company = Company::find($resource->getAttribute('company_id'));

        return $company ? (new CompanyPolicy)->update($user, $company) : Response::denyAsNotFound();
    }

    public function delete(User $user, Model $resource): Response
    {
        return $this->update($user, $resource);
    }
}
